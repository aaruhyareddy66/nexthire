from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import resume, interview, coding, scorecard

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler():
    return {"message": "ok"}

app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(coding.router, prefix="/coding", tags=["coding"])
app.include_router(scorecard.router, prefix="/scorecard", tags=["scorecard"])

@app.get("/")
def home():
    
    return {"message": "nexthire api is running"}