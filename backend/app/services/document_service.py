import os
import uuid
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from fastapi import UploadFile, HTTPException
from app.models.database import Document as DocumentModel, Project, Requirement
from ml.pipelines.document_processor import AdvancedDocumentProcessor
from ml.pipelines.requirement_analyzer import RequirementAnalyzer
import aiofiles

class DocumentService:
    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = "uploads"
        os.makedirs(self.upload_dir, exist_ok=True)

    async def upload_document(self, project_id: int, file: UploadFile) -> DocumentModel:
        # Verify project exists
        project = self.db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(self.upload_dir, unique_filename)

        # Save file
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        # Create document record
        db_document = DocumentModel(
            project_id=project_id,
            filename=file.filename,
            file_path=file_path,
            file_size=len(content),
            file_type=file_extension,
            status="uploaded"
        )
        
        self.db.add(db_document)
        self.db.commit()
        self.db.refresh(db_document)
        
        return db_document

    async def process_document(self, document_id: int):
        document = self.db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
        if not document:
            return

        try:
            # Update status to processing
            document.status = "processing"
            self.db.commit()

            # Process document
            processor = AdvancedDocumentProcessor()
            processed_data = await processor.process_document(document.file_path)

            # Analyze requirements
            analyzer = RequirementAnalyzer()
            analyzed_requirements = analyzer.analyze_requirements(processed_data['requirements'])

            # Save requirements to database
            for req_data in analyzed_requirements:
                requirement = Requirement(
                    document_id=document_id,
                    original_text=req_data['original_text'],
                    requirement_type=req_data['type'],
                    complexity_score=req_data['complexity'],
                    analysis_result=req_data
                )
                self.db.add(requirement)

            # Update document status
            document.status = "processed"
            document.processed_text = processed_data['raw_text']
            document.meta_data = processed_data['metadata']
            
            self.db.commit()

        except Exception as e:
            document.status = "failed"
            self.db.commit()
            raise e

    async def get_project_documents(self, project_id: int) -> List[DocumentModel]:
        return self.db.query(DocumentModel).filter(DocumentModel.project_id == project_id).all()

    async def get_document_status(self, document_id: int) -> Optional[Dict[str, Any]]:
        document = self.db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
        if not document:
            return None

        return {
            "status": document.status,
            "progress": 100 if document.status == "processed" else 50 if document.status == "processing" else 0,
            "message": f"Document is {document.status}"
        }

    async def get_document_requirements(self, document_id: int) -> Optional[List[Dict]]:
        document = self.db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
        if not document:
            return None

        requirements = self.db.query(Requirement).filter(Requirement.document_id == document_id).all()
        return [{
            "id": req.id,
            "original_text": req.original_text,
            "type": req.requirement_type,
            "complexity": req.complexity_score,
            "analysis": req.analysis_result
        } for req in requirements]