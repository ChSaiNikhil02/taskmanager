from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, auth, database

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=List[schemas.Task])
def read_tasks(
    project_id: Optional[int] = None, 
    assigned_to: Optional[str] = None, 
    skip: int = 0, 
    limit: int = 200, 
    db: Session = Depends(database.get_db), 
    current_user = Depends(auth.get_current_user)
):
    return crud.get_tasks(db, project_id=project_id, assigned_to=assigned_to, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    return crud.create_task(db=db, task=task)

@router.patch("/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    db_task = crud.update_task(db, task_id=task_id, task=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    # In frontend, only Admin can delete usually, but let's check current_user role if needed
    if not crud.delete_task(db, task_id=task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"detail": "Task deleted"}
