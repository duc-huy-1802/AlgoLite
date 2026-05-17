from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
import boto3
import json

import os
print(find_dotenv())
load_dotenv()
print("BASE URL:", os.environ.get("OPENAI_BASE_URL"))
print("ACCESS KEY:", os.environ.get("AWS_ACCESS_KEY_ID"))

bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-2")
client = OpenAI()

kwargs = {
    "modelId": "openai.gpt-oss-120b-1:0",
    "contentType": "application/json",
    "accept": "application/json",
    "body": json.dumps({
        "openai_version": "bedrock-2023-05-31",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Write a one-sentence bedtime story about a unicorn."
                    }
                ]
            }
        ]
    })
}
response = bedrock_runtime.invoke_model(**kwargs)
body = json.loads(response['body'].read())
print(body)
'''
response = client.chat.completions.create(
    model="openai.gpt-oss-120b-1:0",
    messages=[
        {
            "role": "system",
            "content": "You are a clown. Give the most fantastical, whimsical responses possible."
        },
        {
            "role": "user",
            "content": "Write a one-sentence bedtime story about a unicorn."
        }
    ]
)
'''

#print(response.choices[0].message.content)
import re

content = body["choices"][0]["message"]["content"]
clean = re.sub(r"<reasoning>.*?</reasoning>", "", content, flags=re.DOTALL).strip()
print(clean)