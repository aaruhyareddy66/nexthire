from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import httpx
import os
import base64
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

JUDGE0_API_KEY = os.getenv("JUDGE0_API_KEY")
JUDGE0_URL = "https://judge0-ce.p.rapidapi.com"

class CodeSubmission(BaseModel):
    code: str
    language_id: int
    problem: str

class CodeReview(BaseModel):
    code: str
    problem: str
    language: str

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
                "description": "Write a function that reverses a string. The input string is given as an array of characters.",
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
    headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
    }
    
    encoded_code = base64.b64encode(data.code.encode()).decode()
    
    async with httpx.AsyncClient() as client_http:
        submit_response = await client_http.post(
            f"{JUDGE0_URL}/submissions?base64_encoded=true&wait=true",
            json={"source_code": encoded_code, "language_id": data.language_id},
            headers=headers
        )
        result = submit_response.json()
    
    output = ""
    if result.get("stdout"):
        output = base64.b64decode(result["stdout"]).decode()
    elif result.get("stderr"):
        output = base64.b64decode(result["stderr"]).decode()
    elif result.get("compile_output"):
        output = base64.b64decode(result["compile_output"]).decode()
    
    return {
        "output": output,
        "status": result.get("status", {}).get("description", "Unknown"),
        "time": result.get("time"),
        "memory": result.get("memory")
    }

@router.post("/review")
async def review_code(data: CodeReview):
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
    
    Return only valid JSON, nothing else.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    
    return {"review": response.choices[0].message.content}