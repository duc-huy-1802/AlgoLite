import json
import os
from decimal import Decimal
from typing import Any, Dict, Optional
import boto3
from botocore.exceptions import ClientError
from openai import OpenAI


QUESTIONS_TABLE = os.environ.get("QUESTIONS_TABLE", "Questions")
APP_REGION = os.environ.get("APP_REGION", "us-east-2")

dynamodb = boto3.resource("dynamodb", region_name=APP_REGION)
questions_table = dynamodb.Table(QUESTIONS_TABLE)

client = OpenAI()
MODEL = "openai.gpt-oss-120b"

system_prompt = """You are a technical interviewer evaluating a candidate's
problem solving approach. There are multiple phases of the question. You are currently
on the phase where the user is identifying programming patterns (there can be multiple) in the question.
You will be given the correct programming patterns. If the user lists all of the patterns correctly,
indicate correctness. If the user lists some of the patterns but not all, indicate that the user got some right but missed some
If the user got none correct, politely tell them to try again. All of your answers should be one sentence long."""

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

        if (event.get("pathParameters")["pattern"] == None):
            return make_response(400, {
                "error": "Missing pattern in path"
            })

        problem_id = event.get("pathParameters")["problem_id"]
        user_answer = event.get("body")["user_answer"]

        if not user_answer:
            return make_response(405, {
                "error": "User solution should not be blank!"
            })

        model_feedback = prompt_model(user_answer, problem_id)
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
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        "body": json.dumps(body, cls=DecimalEncoder)
    }

def prompt_model(user_solution: str, problem_id: str) -> Optional[str]:
    question_info = questions_table.get_item(
        Key={"problem_id": problem_id},
        ProjectionExpression="tags"
    )
    item = question_info.get("Item")
    if not item:
        return None


    title = item.get("title", "")
    statement = item.get("statement", "")
    true_solution = item.get("solution", "")
    expected_steps = item.get("expected_reasoning_steps", "")

    response = client.responses.create(
        model=MODEL,
        input=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "user": f"""Title: {title}\n
                    Description: {statement}\n
                    True solution: {true_solution}\n
                    Expected steps: {expected_steps}\n
                    User solution: {user_solution}"""
            }
        ]
    )
    return response.output_text


[ { "S" : "Start with the brute-force idea of checking every pair." }, { "S" : "Explain that brute force takes O(n^2) time." }, { "S" : "Recognize that faster lookup can improve the solution." }, { "S" : "Use a hash set to store previously seen numbers." }, { "S" : "For each number x, check whether target - x has already appeared." }, { "S" : "Explain that the optimized solution takes O(n) time and O(n) space." } ]