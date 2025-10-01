from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.database import get_db
from app.schemas.project_schemas import Project, ProjectCreate
from app.services.project_service import ProjectService

router = APIRouter()

@router.get("/projects", response_model=List[Project])
async def get_projects(db: Session = Depends(get_db)):
    service = ProjectService(db)
    return await service.get_all_projects()

@router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return await service.create_project(project)

@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: int, db: Session = Depends(get_db)):
    service = ProjectService(db)
    project = await service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/projects/{project_id}")
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    service = ProjectService(db)
    success = await service.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}