from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status, UploadFile
import uuid
from app.models.database import Project, Document
from app.services.document_service import DocumentService
import os
from sqlalchemy import and_


class UploadService:
    def __init__(self, db: Session):
        self.db = db
        self.document_service = DocumentService(db)

    async def quick_upload(self, file: UploadFile, project_name: str, description: str, user_id: int):
        try:
            # Create new project
            project = Project(
                name=project_name,
                description=description,
                user_id=user_id
            )
            self.db.add(project)
            self.db.commit()
            self.db.refresh(project)
            
            # Upload and process document
            document = await self.document_service.upload_document(file, project.id)
            
            return {
                "upload_id": str(uuid.uuid4()),
                "status": "completed",
                "project_id": project.id,
                "document_id": document.id,
                "message": "Document uploaded and processed successfully"
            }
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload failed: {str(e)}"
            )

    async def bulk_upload(self, files: List[UploadFile], project_id: int, user_id: int):
        # Verify project ownership
        project = self.db.query(Project).filter(
            and_(Project.id == project_id, Project.user_id == user_id)
        ).first()
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        upload_id = str(uuid.uuid4())
        results = []
        
        for file in files:
            try:
                document = await self.document_service.upload_document(file, project_id)
                results.append({
                    "filename": file.filename,
                    "status": "success",
                    "document_id": document.id
                })
            except Exception as e:
                results.append({
                    "filename": file.filename,
                    "status": "failed",
                    "error": str(e)
                })
        
        return {
            "upload_id": upload_id,
            "results": results
        }