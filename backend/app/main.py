from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import resume, interview, coding, scorecard

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(coding.router, prefix="/coding", tags=["coding"])
app.include_router(scorecard.router, prefix="/scorecard", tags=["scorecard"])

@app.get("/")
def home():
    return {"message": "nexthire api is running"}