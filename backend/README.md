# Task Manager Backend (FastAPI)

This is the backend for the TaskFlow application, built with FastAPI and SQLAlchemy.

## Features
- **Authentication**: JWT-based login and registration.
- **Role-Based Access**: Admin and Member roles.
- **Projects**: CRUD operations for projects.
- **Tasks**: CRUD operations for tasks with project and user assignment.
- **Database**: PostgreSQL support (configured for Supabase).

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   - Copy `.env.example` to `.env`.
   - Update `DATABASE_URL` with your Supabase connection string.
   - Set a secure `SECRET_KEY`.

3. **Run the Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

## Supabase Database Setup Steps

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and sign in.
   - Click "New Project" and follow the setup.

2. **Get Connection String**:
   - Go to **Project Settings** -> **Database**.
   - Under **Connection string**, select **URI**.
   - Copy the string and replace `[YOUR-PASSWORD]` with the password you set during project creation.

3. **Table Initialization**:
   - The application automatically creates tables when it starts (`Base.metadata.create_all(bind=engine)` in `main.py`).
   - Alternatively, you can run SQL scripts in the Supabase **SQL Editor**.

## Role-Based Access Control
- **Admin**: Can create projects, delete projects/tasks, and invite users.
- **Member**: Can view projects/tasks and update tasks assigned to them.
