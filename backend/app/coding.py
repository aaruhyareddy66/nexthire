from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class CodeSubmission(BaseModel):
    code: str
    language_id: int
    problem: str

class CodeReview(BaseModel):
    code: str
    problem: str
    language: str

def clean_json(text):
    clean = text.strip()
    if clean.startswith("```"):
        parts = clean.split("```")
        if len(parts) >= 2:
            clean = parts[1]
            if clean.startswith("json"):
                clean = clean[4:]
    return clean.strip()

@router.get("/problems")
async def get_problems():
    return {
        "problems": [
            {
                "id": 1,
                "title": "Two Sum",
                "difficulty": "Easy",
                "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "examples": "Input: nums = [2,7,11,15], target = 9 Output: [0,1]",
                "language_id": 71
            },
            {
                "id": 2,
                "title": "Reverse a String",
                "difficulty": "Easy",
                "description": "Write a function that reverses a string.",
                "examples": "Input: s = 'hello' Output: 'olleh'",
                "language_id": 71
            },
            {
                "id": 3,
                "title": "FizzBuzz",
                "difficulty": "Easy",
                "description": "Print numbers 1 to n. For multiples of 3 print Fizz, for multiples of 5 print Buzz, for both print FizzBuzz.",
                "examples": "Input: n = 15 Output: 1,2,Fizz,4,Buzz,...,FizzBuzz",
                "language_id": 71
            }
        ]
    }

@router.post("/submit")
async def submit_code(data: CodeSubmission):
    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            response = await client_http.post(
                "https://glot.io/api/run/python/latest",
                headers={
                    "Content-type": "application/json",
                },
                json={
                    "files": [
                        {
                            "name": "main.py",
                            "content": data.code
                        }
                    ]
                }
            )
            result = response.json()

        stdout = result.get("stdout", "")
        stderr = result.get("stderr", "")
        output = stdout if stdout else stderr if stderr else str(result)

        return {
            "output": output,
            "status": "Accepted",
            "time": None,
            "memory": None
        }
    except Exception as e:
        return {"output": f"Error: {str(e)}", "status": "Error"}

@router.post("/review")
async def review_code(data: CodeReview):
    try:
        prompt = f"""
        Review this code and give a score out of 100.
        Return JSON with:
        - score (number out of 100)
        - time_complexity (e.g. O(n))
        - space_complexity (e.g. O(1))
        - feedback (2-3 lines)
        - improvements (list of 2 suggestions)
        - is_correct (true or false)

        Problem: {data.problem}
        Language: {data.language}
        Code:
        {data.code}

        Return only valid JSON, no markdown, no backticks.
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        result = response.choices[0].message.content
        clean = clean_json(result)

        return {"review": clean}
    except Exception as e:
        return {"review": f"Error: {str(e)}"}