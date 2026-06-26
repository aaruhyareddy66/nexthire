from fastapi import APIRouter, UploadFile, File
from groq import Groq
import PyPDF2
import spacy
import io
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
nlp = spacy.load("en_core_web_sm")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text_from_pdf(file_bytes):
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_skills(text):
    skills = []
    skill_keywords = ["python", "javascript", "react", "node", "sql", "machine learning",
                      "deep learning", "fastapi", "django", "flask", "java", "c++", "git",
                      "docker", "aws", "mongodb", "postgresql", "typescript", "html", "css"]
    text_lower = text.lower()
    for skill in skill_keywords:
        if skill in text_lower:
            skills.append(skill)
    return skills

def clean_json(text):
    clean = text.strip()
    if clean.startswith("```"):
        parts = clean.split("```")
        if len(parts) >= 2:
            clean = parts[1]
            if clean.startswith("json"):
                clean = clean[4:]
    return clean.strip()

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    file_bytes = await file.read()
    text = extract_text_from_pdf(file_bytes)
    skills = extract_skills(text)

    prompt = f"""
    Analyze this resume and give a score out of 100.
    Return a JSON with these fields:
    - score (number out of 100)
    - strengths (list of 3 good things)
    - weaknesses (list of 3 things to improve)
    - skills_found (list of skills you found)
    - summary (2 line summary)

    Resume text:
    {text[:3000]}

    Return only valid JSON, nothing else. No markdown, no backticks.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    result = response.choices[0].message.content
    clean = clean_json(result)

    return {
        "raw_analysis": clean,
        "skills_found": skills,
        "text_extracted": text[:500]
    }