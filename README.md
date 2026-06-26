# NextHire

A full stack AI-powered placement preparation platform. Upload your resume, go through an AI interview, solve coding problems, and get a final scorecard — all in one place.

## Live Demo

https://nexthire-sooty.vercel.app

## What I Built

I built this project to help students prepare for placements. It covers the full interview process — resume screening, HR + technical interview, coding round, and a final score.

## Features

- Resume upload and AI analysis with score out of 100
- AI interviewer that reads your resume and asks relevant questions
- Coding editor with live Python execution in the browser
- AI code review with time and space complexity analysis
- Final scorecard with weighted breakdown of all rounds

## Tech Stack

**Frontend**
- React.js
- Monaco Editor (VS Code editor in browser)
- Recharts (scorecard charts)
- Tailwind CSS

**Backend**
- FastAPI (Python)
- Groq API with LLaMA 3.3 70B
- PyPDF2 (resume parsing)
- spaCy (skill extraction)

**Deployment**
- Vercel (frontend)
- Render (backend)
- GitHub (version control)

## How to Run Locally

### Backend

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

### Frontend

cd frontend
npm install
npm start

### Environment Variables

Create a `.env` file in the backend folder:

GROQ_API_KEY=your_groq_api_key_here

## Scorecard Breakdown

| Round | Weight |
|-------|--------|
| Resume Score | 20% |
| Communication | 20% |
| Technical Answers | 30% |
| Code Quality | 30% |

## Author

Aaruhya Reddy
GitHub: https://github.com/aaruhyareddy66
