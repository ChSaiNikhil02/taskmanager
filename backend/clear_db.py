import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")

try:
    engine = create_engine(db_url)
    with engine.connect() as connection:
        # We need to clear tables in the correct order due to foreign keys
        connection.execute(text("TRUNCATE TABLE tasks, projects, users RESTART IDENTITY CASCADE;"))
        connection.commit()
        print("SUCCESS: All user, project, and task data has been cleared from the database.")
except Exception as e:
    print(f"FAILED: {e}")
