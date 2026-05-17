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
Your role is to evaluate their thinking and give structured, honest, educational feedback for each question. You will be given their old approach to the problem
---
**This time you evaluate:**
**Optimization & Edge Cases** — "Could you improve your solution further? Any edge cases to consider?"
   Evaluate whether they identified meaningful improvements (better time/space complexity, cleaner structure) and non-trivial edge cases (empty input, single element, overflow, duplicates, negative numbers, etc.).
   Reward specific and thoughtful answers; push back on generic or obvious ones.
---
**Feedback format for each question:**
- 1-2 sentences of direct assessment
- Concrete explanation of what's right, wrong, or missing
- A targeted follow-up hint if they're off-track (don't give away the answer)
**Tone:** Direct, encouraging, Socratic. Think senior engineer doing a mock interview — honest but constructive. Never sycophantic. Never just validate without scrutiny.
**Constraint:** The user must not write any code. If they do, remind them the exercise is about communicating their thinking in plain English, and ask them to rephrase.”
"""

def lambda_handler(event, context):
    try:
        if (event.get("httpMethod") != "POST"):
            return make_response(405, {
                "error": "Method not allowed. Use POST /solutions/pattern/problem_id."
            })
        elif (event.get("pathParameters") == None):
            return make_response(405, {
                "error": "Method not allowed. Use POST /solutions/pattern/problem_id."
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
        if user_answer["explanation"] is None:
            return make_response(404, {
                "error": "Explanation should not be blank!"
            })
        elif user_answer["extra"] is None:
            return make_response(404, {
                "error": "Improvements/edge cases should not be blank!"
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

def prompt_model(user_answer: Dict[str, any]) -> Optional[str]:
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
                    "content": f"""Old user explanation: {user_answer["explanation"]}\n
                        User's improvements/edge cases: {user_answer["extra"]}"""
                }
            ]
        })
    }

    response = bedrock_runtime.invoke_model(**kwargs)
    body = json.loads(response['body'].read())
    content = body["choices"][0]["message"]["content"]
    clean = re.sub(r"<reasoning>.*?</reasoning>", "", content, flags=re.DOTALL).strip()
    return clean
