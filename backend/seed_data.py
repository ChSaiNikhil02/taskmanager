import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)

def seed_data():
    with engine.connect() as conn:
        # 1. Add Team Members
        users = [
            ("dev@taskflow.com", "Dev Team", "member"),
            ("design@taskflow.com", "Design Pro", "member"),
        ]
        for email, name, role in users:
            conn.execute(text(
                "INSERT INTO users (email, full_name, hashed_password, role) VALUES (:email, :name, :pwd, :role) ON CONFLICT DO NOTHING"),
                {"email": email, "name": name, "pwd": "password123", "role": role}
            )

        # 2. Add Projects
        projects = [
            ("Website Redesign", "Overhaul the main landing page and service pages", "high"),
            ("Mobile App Launch", "Prepare marketing materials and final build for App Store", "critical"),
            ("Q2 Internal Audit", "Internal review of operational processes", "low"),
        ]
        for name, desc, priority in projects:
            conn.execute(text(
                "INSERT INTO projects (name, description, priority, status) VALUES (:name, :desc, :priority, 'active')"),
                {"name": name, "desc": desc, "priority": priority}
            )

        # 3. Add Tasks
        tasks = [
            ("Research competitors", "Compare UI/UX with top competitors", "medium", "todo", 1, "dev@taskflow.com"),
            ("Draft wireframes", "Create low-fidelity mockups for new site", "high", "in_progress", 1, "design@taskflow.com"),
            ("Review branding guidelines", "Ensure assets align with brand identity", "low", "done", 1, "design@taskflow.com"),
            ("Create social media assets", "Ads for Instagram and LinkedIn", "high", "todo", 2, "design@taskflow.com"),
            ("Fix navigation bug", "Resolve broken link on footer", "critical", "in_progress", 1, "dev@taskflow.com"),
        ]
        for title, desc, prio, status, proj_id, email in tasks:
            conn.execute(text(
                "INSERT INTO tasks (title, description, priority, status, project_id, assigned_to) VALUES (:title, :desc, :prio, :status, :proj_id, :email)"),
                {"title": title, "desc": desc, "prio": prio, "status": status, "proj_id": proj_id, "email": email}
            )
        
        conn.commit()
        print("Demo data seeded successfully.")

if __name__ == '__main__':
    seed_data()
