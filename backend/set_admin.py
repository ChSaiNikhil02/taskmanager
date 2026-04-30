import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
target_email = "sainikhilchithanuri02@gmail.com"

try:
    engine = create_engine(db_url)
    with engine.connect() as connection:
        # Check if user exists first
        result = connection.execute(text("SELECT email FROM users WHERE email = :email"), {"email": target_email}).fetchone()
        
        if result:
            connection.execute(
                text("UPDATE users SET role = 'admin' WHERE email = :email"),
                {"email": target_email}
            )
            connection.commit()
            print(f"SUCCESS: User {target_email} has been promoted to admin.")
        else:
            print(f"ERROR: User {target_email} not found in the database. Please sign up first.")
except Exception as e:
    print(f"FAILED: {e}")
