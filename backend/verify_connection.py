import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
print(f"Testing direct connection with: {db_url}")

try:
    engine = create_engine(db_url)
    with engine.connect() as connection:
        print("SUCCESS: Connected to the database!")
except Exception as e:
    print(f"FAILED: {e}")
