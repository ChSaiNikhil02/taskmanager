from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth_router, projects, tasks, users
from .database import engine, Base

import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Manager API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://believable-generosity-production.up.railway.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Task Manager API"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
