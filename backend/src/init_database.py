import os
from dotenv import load_dotenv
from supabase import create_client, Client


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


def create_database_client() -> Client:
    print(f"Initializing database connection...")
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print(f"Database connection initialized.")
    return supabase_client
