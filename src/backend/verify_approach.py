import json
import os
from decimal import Decimal
from typing import Any, Dict, Optional
import boto3
from botocore.exceptions import ClientError
import re


QUESTIONS_TABLE = os.environ.get("QUESTIONS_TABLE", "Questions")
APP_REGION = os.environ.get("APP_REGION", "us-east-2")

dynamodb = boto3.resource("dynamodb", region_name=APP_REGION)
questions_table = dynamodb.Table(QUESTIONS_TABLE)

bedrock_runtime = boto3.client("bedrock-runtime", region_name=APP_REGION)
MODEL_ID="openai.gpt-oss-120b-1:0"

system_prompt = """“You are an expert coding interview coach helping users develop deep problem-solving intuition for LeetCode-style problems. The user is given a specific LeetCode problem and must answer four questions in plain English — no code allowed.
Your role is to evaluate their thinking and give structured, honest, educational feedback for each question. You will be given the relevant programming patterns.
---
**This time you evaluate:**
**Approach Description** — "Describe your approach to solving this in plain English."
   This is the most important question.
   Actively look for contradictions, logical gaps, and hand-wavy steps in their explanation.
   Challenge any part that doesn't hold up — if their approach would not actually produce a correct solution, say so clearly and explain why.
   Don't be lenient here. A vague or self-contradicting explanation should be flagged, not praised.
---
**Feedback format for each question:**
- 1–2 sentences of direct assessment
- Concrete explanation of what's right, wrong, or missing
- A targeted follow-up hint if they're off-track (don't give away the answer)
**Tone:** Direct, encouraging, Socratic. Think senior engineer doing a mock interview — honest but constructive. Never sycophantic. Never just validate without scrutiny.
**Constraint:** The user must not write any code. If they do, remind them the exercise is about communicating their thinking in plain English, and ask them to rephrase.”
"""

def lambda_handler(event, context):
    try:
        if (event.get("httpMethod") != "POST"):
            return make_response(405, {
                "error": "Method not allowed. Use POST /solutions/approach/problem_id."
            })
        elif (event.get("pathParameters") == None):
            return make_response(405, {
                "error": "Method not allowed. Use POST /solutions/approach/problem_id."
            })
        elif (event.get("body") == None):
            return make_response(405, {
                "error": "Method not allowed. User body should not be blank"
            })

        problem_id = event.get("pathParameters")["problem_id"]
        body = json.loads(event.get("body") or "{}")
        user_answer = body.get("user_answer")

        if not user_answer:
            return make_response(405, {
                "error": "User solution should not be blank!"
            })

        model_feedback = prompt_model(user_answer, problem_id)
        if (model_feedback is None):
            return make_response(500, {
                "error": "No response was made"
            })
        return make_response(200, {"feedback": model_feedback})

    except ClientError as e:
        print(f"DynamoDB error: {e}")
        return make_response(500, {"error": "database error"})
    except Exception as e:
        print(f"unexpected error: {e}")
        return make_response(500, {"error": str(e)})

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)

def make_response(status_code: int, body: Dict[str, any]) -> Dict[str, any]:
    return {
        "statusCode": status_code,
         "headers": {
            "Content-Type": "application/json",

            # For development. For production, replace * with your Amplify domain.
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST"
        },
        "body": json.dumps(body, cls=DecimalEncoder)
    }

def prompt_model(user_answer: str, problem_id: str) -> Optional[str]:
    question_info = questions_table.get_item(
        Key={"problem_id": problem_id},
        ProjectionExpression="title, tags"
    )
    item = question_info.get("Item")
    if not item:
        return None

    title = item.get("title", "")
    true_patterns = ", ".join(item.get("tags", []))

    kwargs = {
        "modelId": MODEL_ID,
        "contentType": "application/json",
        "accept": "application/json",
        "body": json.dumps({
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": f"""Title: {title}\n
                        Correct patterns: {true_patterns}\n
                        User's approach: {user_answer}"""
                }
            ]
        })
    }

    response = bedrock_runtime.invoke_model(**kwargs)
    body = json.loads(response['body'].read())
    content = body["choices"][0]["message"]["content"]
    clean = re.sub(r"<reasoning>.*?</reasoning>", "", content, flags=re.DOTALL).strip()
    return clean
