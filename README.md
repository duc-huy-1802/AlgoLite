# AlgoLite

> Lower the barrier to technical interview prep. Let's focus on *how* you think, not whether you can write perfect code.

---

## Overview

AlgoLite is a platform that makes technical interview preparation more accessible by shifting the focus from syntax and implementation to **critical thinking, pattern recognition, and communication**. Instead of requiring users to produce a working coded solution, AlgoLite asks them to explain their reasoning in plain English or pseudocode and to analyze their own code. These are the skills that actually matter for interviews (especially in the age of AI).

### Who Is This For?

- Beginners just getting started with algorithm questions
- Candidates who want to improve their interview communication skills
- Anyone on a tight prep timeline who needs to build intuition fast

---

## Features

### Core (MVP)

| Feature | Description |
|---|---|
| **Problem Selection** | Browse and select from a curated database of algorithm and system design questions |
| **Pattern Recognition** | Identify what algorithmic pattern applies and explain why — AI evaluates your reasoning |
| **Approach Explanation** | Describe your solution in plain English or pseudocode — AI actively challenges contradictions and logical gaps |
| **Complexity Analysis** | Submit your Big O time and space estimates — AI checks them against your described approach |
| **AI Challenges** | Edge cases, "what if" questions, and contradictions to stress-test your reasoning |
| **Interactive Walkthrough** | Animated simulation of the correct solution if you get stuck or give up |
| **Feedback & Scoring** | Structured feedback on reasoning quality, communication, and optimization |

### Planned / Stretch

- Hint system with progressive reveals
- Daily problem challenge
- Mobile-friendly pseudocode keyword toolbar
- Expansion to other disciplines (business case interviews, medical diagnosis reasoning, legal argument construction, PM feature prioritization)

---

## Architecture

AlgoLite is built on a serverless AWS stack.

```
AWS Amplify (Frontend)
        │
        ▼
  API Gateway
        │
        ▼
   AWS Lambda Functions
   ├── web_scraper        (scheduled every 24h)
   ├── get_question       (GET /questions, GET /questions/{id})
   ├── submit_solution    (POST /solution/{id})
   └── get_solution       (GET /solution — full walkthrough)
        │
        ├──▶ DynamoDB      (problem storage)
        └──▶ Amazon Bedrock (AI evaluation & feedback)
```

> Full architecture diagram: [View on Google Drive](https://drive.google.com/file/d/1kETBVjuq_Z6etCCvA0YYO2Za21D5CeOf/view?usp=sharing)

---

## API Reference

All endpoints are exposed through API Gateway and backed by Lambda.

### Questions

#### `GET /questions`
Returns all problems in the database.

#### `GET /questions/{problem_id}`
Returns a single problem by ID.

#### `POST /questions`
Ingests a scraped or imported problem into DynamoDB. Used internally by the web scraper Lambda.

**Request body example:**
```json
{
  "problem_id": "algo_valid_parentheses_001",
  "title": "Valid Parentheses",
  "difficulty": "easy",
  "tags": ["stack", "string"],
  "statement": "Given a string containing brackets, determine whether it is valid.",
  "solution": "Use a stack. Push opening brackets and match closing brackets with the top of the stack.",
  "expected_reasoning_steps": [
    "Use a stack to track opening brackets.",
    "Check each closing bracket against the top of the stack.",
    "Return true only if the stack is empty at the end."
  ],
  "edge_cases": ["Empty string", "Only closing brackets", "Mismatched bracket types"],
  "complexity": { "time": "O(n)", "space": "O(n)" },
  "source_url": "https://example.com/source",
  "source_type": "scraped_or_imported"
}
```

---

### Solutions

#### `POST /solution/pattern/{problem_id}`
Evaluates the user's pattern recognition answer (Step 1).

#### `POST /solution/approach/{problem_id}`
Evaluates the user's plain-English approach explanation (Step 2). AI actively looks for contradictions and logical gaps.

#### `POST /solution/bigO/{problem_id}`
Evaluates the user's Big O analysis (Step 3).

**Request body:**
```json
{
  "user_answer": {
    "time_complexity": "O(n)",
    "space_complexity": "O(n)",
    "explanation": "We iterate through the array once and store elements in a hash map."
  }
}
```

#### `POST /solution/extra/{problem_id}`
Evaluates optimization ideas and edge case awareness (Step 4).

---

## Database Schema (DynamoDB)

Each problem is stored as a DynamoDB item with the following structure:

```json
{
  "problem_id": "algo_two_sum_001",
  "description": """Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.""",
  "title": "Find a Pair with Target Sum",
  "difficulty": "easy",
  "examples": { "output" : { "S" : "[0,1]" }, "explanation" : { "S" : "Because nums[0] + nums[1] == 9, we return [0, 1].\n" }, "input" : { "S" : "nums = [2,7,11,15], target = 9" } },
  "tags": ["array", "hash_map"],
  "viz-url": "two-sum.mp4"
}
```

---

## AI Evaluation (Amazon Bedrock)

Each of the four user-facing questions is evaluated by a dedicated Bedrock prompt with a tailored system instruction. All prompts share the same feedback format and tone guidelines.

**Feedback format:**
- 1–2 sentence direct assessment
- Concrete explanation of what's right, wrong, or missing
- Targeted follow-up hint if the user is off-track (without giving away the answer)

**Tone:** Direct, encouraging, Socratic — like a senior engineer running a mock interview. Never sycophantic.

**Constraint enforced by all prompts:** Users must not write code. If they do, the AI asks them to rephrase in plain English.

### Prompt Responsibilities

| Endpoint | Bedrock evaluates |
|---|---|
| `/solution/pattern` | Correct identification of the algorithmic pattern and reasoning for why it applies |
| `/solution/approach` | Logical correctness of the described approach; actively challenges contradictions and hand-wavy steps |
| `/solution/bigO` | Accuracy of Big O time/space estimates relative to the approach the user described |
| `/solution/extra` | Quality of optimization ideas and non-trivial edge cases identified |

---

## Lambda Functions

| Function | Trigger | Responsibility |
|---|---|---|
| `web_scraper` | EventBridge (every 24h) | Scrapes problems and syncs to DynamoDB |
| `get_question` | `GET /questions[/{id}]` | Fetches one or all problems |
| `submit_solution` | `POST /solution/{id}` | Sends user solution to Bedrock, cross-references with stored solution, returns feedback |
| `verify_pattern` | `POST /solution/pattern/{id}` | Prompts Bedrock for evaluation on identifying the programming pattern on a specified question
| `verify_approach` | `POST /solution/approach/{id}` | Prompts Bedrock for evaluation on the user's high-level approach to a question
| `verify_bigO` | `POST /solution/bigO/{id}` | Prompts Bedrock for evaluation on identifying the time and space complexity of the user's given approach
| `verify_extra` | `POST /solution/extra/{id}` | Prompts Bedrock for evaluation on a user's description of how to improve their own implementation and any edge cases that they may have to consider

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | AWS Amplify |
| API | Amazon API Gateway |
| Backend Logic | AWS Lambda (Python / Node.js) |
| AI / LLM | Amazon Bedrock |
| Database | Amazon DynamoDB |
| Storage | Amazon S3 |
| Scraping | Scheduled Lambda → DynamoDB/S3 |

---

## Team
Henry Nguyen, Thanh Trinh, Thomas Huynh

**AlgoLite** — built to make the interview prep journey less intimidating, one plain-English explanation at a time.