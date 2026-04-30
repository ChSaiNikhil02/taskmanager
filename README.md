# TaskFlow: Professional Project Management System

TaskFlow is a modern, full-stack project management application designed for teams to create projects, assign tasks, and track progress with role-based access control.

## 🏗️ Architecture

- **Frontend**: [React](https://react.dev/) with [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Shadcn UI](https://ui.shadcn.com/).
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python) providing a RESTful API.
- **Database**: [PostgreSQL](https://www.postgresql.org/) managed via [Supabase](https://supabase.com/).
- **Deployment**: [Railway](https://railway.app/).

---

## 📁 Project Structure

```text
taskmanager/
├── backend/            # FastAPI Python application
│   ├── app/            # Core logic (models, routes, auth, crud)
│   ├── .env            # Environment variables (not committed)
│   └── Procfile        # Railway deployment instructions
├── frontend/           # React frontend application
│   ├── src/            # Components, pages, and API client
│   └── vite.config.js  # Vite configuration
└── .gitignore          # Excludes secrets and temporary files
```

---

## ⚙️ Setup & Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Configure your .env file with DATABASE_URL
python -m uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Ensure VITE_API_URL is set in your .env or system env
npm run dev
```

---

## ☁️ Deployment Guide (Railway)

### 1. Backend Deployment
1.  Connect your GitHub repository to Railway.
2.  Set the **Root Directory** to `/backend`.
3.  Add the environment variables: `DATABASE_URL` (Supabase connection string) and `SECRET_KEY`.
4.  Railway will automatically detect the `Procfile` and start the server.
5.  Save the generated domain (e.g., `https://backend.up.railway.app`).

### 2. Frontend Deployment
1.  Add a new service from your GitHub repository.
2.  Set the **Root Directory** to `/frontend`.
3.  Add the environment variable `VITE_API_URL` using the backend domain from step 1.
4.  Ensure the build command is `npm run build` and install command is `npm install`.

---

## 🔐 Role-Based Access Control (RBAC)

TaskFlow implements security at the API level:
- **Admin**: Full access to project management, task deletion, and inviting new team members.
- **Member**: Limited access to view and update their assigned tasks.

---

## 🛠️ Supabase Configuration
- **SSL**: The backend is configured to require `sslmode=require` when connecting to Supabase.
- **Initialization**: Tables are automatically created upon the first backend deployment using SQLAlchemy's `Base.metadata.create_all()`.
