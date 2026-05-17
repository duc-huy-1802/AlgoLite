import json
import os
from decimal import Decimal
from typing import Any, Dict, Optional
import boto3
from botocore.exceptions import ClientError


QUESTIONS_TABLE = os.environ.get("QUESTIONS_TABLE", "Questions")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-2")

dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
questions_table = dynamodb.Table(QUESTIONS_TABLE)

def lambda_handler(event, context):
    try:
        if (event.get("httpMethod") != "GET"):
            return make_response(405, {
                "error": "Method not allowed. Use GET /questions/problem_id."
            })
        elif (event.get("pathParameters") == None):
            return make_response(405, {
                "error": "Method not allowed. Use GET /questions/problem_id."
            })

        question = get_question(event.get("pathParameters"))
        if not question:
            return make_response(404, {"error": "Question not found"})

        return make_response(200, {"questions": question})

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

def get_question(problem_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves all questions from DynamoDB
    """
    try:

        question = questions_table.get_item(
            Key={"problem_id": problem_id}
        )

        return question
    except Exception as e:
        print(f"error scanning DynamoDB: {e}")
        raise
