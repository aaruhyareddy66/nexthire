from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ScoreData(BaseModel):
    resume_score: float
    communication_score: float
    technical_score: float
    code_score: float

@router.post("/generate")
async def generate_scorecard(data: ScoreData):
    final_score = (
        data.resume_score * 0.20 +
        data.communication_score * 0.20 +
        data.technical_score * 0.30 +
        data.code_score * 0.30
    )
    
    if final_score >= 80:
        grade = "A"
        verdict = "Excellent candidate! Ready for top companies."
    elif final_score >= 65:
        grade = "B"
        verdict = "Good candidate! Keep practicing."
    elif final_score >= 50:
        grade = "C"
        verdict = "Average candidate. Needs improvement."
    else:
        grade = "D"
        verdict = "Needs significant improvement."
    
    return {
        "final_score": round(final_score, 2),
        "grade": grade,
        "verdict": verdict,
        "breakdown": {
            "resume": {"score": data.resume_score, "weight": "20%"},
            "communication": {"score": data.communication_score, "weight": "20%"},
            "technical": {"score": data.technical_score, "weight": "30%"},
            "code_quality": {"score": data.code_score, "weight": "30%"}
        }
    }