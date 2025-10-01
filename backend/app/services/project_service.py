from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.database import Project as ProjectModel
from app.schemas.project_schemas import ProjectCreate
from datetime import datetime

class ProjectService:
    def __init__(self, db: Session):
        self.db = db

    async def get_all_projects(self) -> List[ProjectModel]:
        projects = self.db.query(ProjectModel).all()
        # Ensure updated_at is never None
        for project in projects:
            if project.updated_at is None:
                project.updated_at = project.created_at or datetime.utcnow()
        return projects

    async def get_project(self, project_id: int) -> Optional[ProjectModel]:
        project = self.db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
        if project and project.updated_at is None:
            project.updated_at = project.created_at or datetime.utcnow()
        return project

    async def create_project(self, project: ProjectCreate) -> ProjectModel:
        db_project = ProjectModel(**project.dict())
        # Set both created_at and updated_at explicitly
        now = datetime.utcnow()
        db_project.created_at = now
        db_project.updated_at = now
        
        self.db.add(db_project)
        self.db.commit()
        self.db.refresh(db_project)
        return db_project

    async def delete_project(self, project_id: int) -> bool:
        project = self.db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
        if project:
            self.db.delete(project)
            self.db.commit()
            return True
        return False