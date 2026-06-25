from fastapi import APIRouter
from groq import Groq
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class Message(BaseModel):
    message: str
    history: list = []
    resume_summary: str = ""

@router.post("/start")
async def start_interview(data: Message):
    system_prompt = f"""
    You are a professional technical interviewer at a top tech company.
    You are interviewing a candidate based on their resume.
    Resume summary: {data.resume_summary}
    
    Rules:
    - Ask one question at a time
    - Start with introduction and easy questions
    - Then move to technical questions based on their skills
    - Be professional but friendly
    - After 5-6 questions, wrap up the interview
    - Give encouraging feedback
    """
    
    messages = [{"role": "system", "content": system_prompt}]
    
    for h in data.history:
        messages.append(h)
    
    messages.append({"role": "user", "content": data.message})
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
    )
    
    return {
        "response": response.choices[0].message.content,
        "tokens_used": response.usage.total_tokens
    }

@router.post("/evaluate")
async def evaluate_interview(data: Message):
    prompt = f"""
    Evaluate this interview conversation and give a score out of 100.
    Return JSON with:
    - score (number out of 100)
    - communication_score (number out of 100)
    - technical_score (number out of 100)
    - feedback (2-3 lines of feedback)
    - strengths (list of 2 good things)
    - improvements (list of 2 things to improve)
    
    Interview history:
    {data.history}
    
    Return only valid JSON, nothing else.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    
    return {"evaluation": response.choices[0].message.content}