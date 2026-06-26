from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app import resume, interview, coding, scorecard

app = FastAPI()

@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        response = JSONResponse(content={}, status_code=200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response
    
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(coding.router, prefix="/coding", tags=["coding"])
app.include_router(scorecard.router, prefix="/scorecard", tags=["scorecard"])

@app.get("/")
def home():
    return {"message": "nexthire api is running"}