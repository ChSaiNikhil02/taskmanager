import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

passwords = ["Sainikhil", "Sainikhil "]
usernames = ["postgres.koiktonnujqdnbcqhpsu", "postgres"]
host = "aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

for user in usernames:
    for pwd in passwords:
        db_url = f"postgresql://{user}:{pwd}@{host}"
        print(f"Testing: user={user}, password={'***' if pwd else 'None'}")
        try:
            engine = create_engine(db_url)
            with engine.connect() as connection:
                print(f"SUCCESS with user={user}, password={pwd}")
                # Update .env if successful
                with open(".env", "w") as f:
                    f.write(f"DATABASE_URL={db_url}\n")
                    f.write("SECRET_KEY=9a62c97486f0302b1c7c907b225964923e3e0a12e3e0a12e3e0a12e3e0a12\n")
                    f.write("ACCESS_TOKEN_EXPIRE_MINUTES=60\n")
                exit(0)
        except Exception as e:
            print(f"Failed: {str(e)[:100]}")
