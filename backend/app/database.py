import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

def get_db_status():
    return {"status": "connected", "database": "supabase"}