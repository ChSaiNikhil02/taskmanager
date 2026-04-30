from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, auth, database

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/", response_model=List[schemas.Project])
def read_projects(db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    return crud.get_projects(db)

@router.post("/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    return crud.create_project(db=db, project=project, user_id=current_user.id)

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    db_project = db.query(database.models.Project).filter(database.models.Project.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.patch("/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    # Only Admin or Owner can update? Let's keep it simple for now as requested.
    db_project = crud.update_project(db, project_id=project_id, project=project)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_active_admin)):
    if not crud.delete_project(db, project_id=project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return {"detail": "Project deleted"}
