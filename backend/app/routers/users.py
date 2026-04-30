from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, auth, database

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    return db.query(database.models.User).offset(skip).limit(limit).all()

@router.post("/invite")
def invite_user(email: str, role: str, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_active_admin)):
    # Simple mock invitation: just create a user with a default password
    db_user = crud.get_user_by_email(db, email=email)
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = schemas.UserCreate(
        email=email,
        full_name=email.split("@")[0],
        password="password123", # Default password
        role=role
    )
    return crud.create_user(db=db, user=new_user)
