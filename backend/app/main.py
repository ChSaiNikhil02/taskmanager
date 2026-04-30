from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import traceback
import sys

# ... (imports)

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables synchronized successfully.")
except Exception as e:
    print(f"Error during database synchronization: {e}")

app = FastAPI(title="Task Manager API")

# Global Exception Handler to capture 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_detail = "".join(traceback.format_exception(*sys.exc_info()))
    print(f"CRITICAL ERROR: {exc}")
    print(error_detail)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Use wildcard while debugging to eliminate CORS as a variable
    allow_credentials=True,
    allow_methods=["*"],
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
