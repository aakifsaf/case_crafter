import os
import uuid
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from fastapi import UploadFile, HTTPException
from app.models.database import Document as DocumentModel, Project, Requirement
from ml.pipelines.document_processor import AdvancedDocumentProcessor
from ml.pipelines.requirement_analyzer import SemanticRequirementAnalyzer
import aiofiles
import logging
from datetime import datetime
from ml.pipelines.ai_requirement_enhancer import AIRequirementEnhancer

logger = logging.getLogger(__name__)

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
            print(f"Processed data: {processed_data}")

            if not processed_data['success']:
                document.status = "failed"
                self.db.commit()
                return
            # Analyze requirements
            semantic_analyzer = SemanticRequirementAnalyzer()

            # Extract and analyze requirements with BERT/spaCy
            raw_requirements = semantic_analyzer.extract_requirements(processed_data["raw_text"])
            analyzed_requirements = raw_requirements  

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
        
    async def enhance_requirements(self, document_id: int):
        """Enhance requirements for a document - called after initial processing"""
        document = self.db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
        if not document:
            return

        try:
            # Get unenhanced requirements
            requirements = self.db.query(Requirement).filter(
                Requirement.document_id == document_id
            ).all()

            if not requirements:
                logger.info(f"No requirements to enhance for document {document_id}")
                return

            # Convert to dict for processing
            req_dicts = []
            for req in requirements:
                req_dict = {
                    'id': req.id,
                    'original_text': req.original_text,
                    'type': req.requirement_type,
                    'complexity': req.complexity_score,
                    'analysis_result': req.analysis_result
                }
                req_dicts.append(req_dict)

            # Enhance requirements
            ai_enhancer = AIRequirementEnhancer()
            enhanced_requirements = await ai_enhancer.enhance_requirements(req_dicts)

            # Update requirements with enhanced data
            for enhanced_req in enhanced_requirements:
                requirement = self.db.query(Requirement).filter(
                    Requirement.id == enhanced_req['id']
                ).first()
                
                if requirement:
                    requirement.original_text = enhanced_req['description']
                    requirement.requirement_type = enhanced_req['requirement_type']
                    requirement.complexity_score = enhanced_req['complexity_score']
                    requirement.analysis_result = enhanced_req

            # Update document status
            document.status = "enhanced"
            self.db.commit()

            logger.info(f"Enhanced {len(enhanced_requirements)} requirements for document {document_id}")

        except Exception as e:
            logger.error(f"Failed to enhance requirements for document {document_id}: {e}")
            document.status = "enhancement_failed"
            self.db.commit()

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
            "complexity": req.complexity_score
        } for req in requirements]