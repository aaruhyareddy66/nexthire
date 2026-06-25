from pydantic import BaseModel
from typing import Optional, List

class ResumeAnalysis(BaseModel):
    score: float
    strengths: List[str]
    weaknesses: List[str]
    skills_found: List[str]
    summary: str

class InterviewMessage(BaseModel):
    role: str
    content: str

class InterviewSession(BaseModel):
    session_id: str
    messages: List[InterviewMessage]
    resume_summary: Optional[str] = ""

class CodeSubmissionResult(BaseModel):
    output: str
    status: str
    time: Optional[str]
    memory: Optional[str]

class FinalScore(BaseModel):
    resume_score: float
    communication_score: float
    technical_score: float
    code_score: float
    final_score: float
    grade: str
    verdict: str