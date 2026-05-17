from openai import OpenAI

client = OpenAI()
model = "openai.gpt-oss-120b"

def verify_solution(user_solution: str):



response = client.responses.create(
    model="openai.gpt-oss-120b",
    input=[
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

print(response.output_text)  # not response.output_text