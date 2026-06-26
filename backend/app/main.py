from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app import resume, interview, coding, scorecard

app = FastAPI()

@app.middleware("http")
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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