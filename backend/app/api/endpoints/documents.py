from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.models.database import get_db
from app.schemas.document_schemas import Document, DocumentCreate, ProcessingStatus
from app.services.document_service import DocumentService

router = APIRouter()

@router.post("/projects/{project_id}/documents", response_model=Document)
async def upload_document(
    project_id: int,
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    service = DocumentService(db)
    
    # Validate file type
    allowed_types = ['.pdf', '.docx', '.txt']
    if not any(file.filename.endswith(ext) for ext in allowed_types):
        raise HTTPException(status_code=400, detail="File type not supported")
    
    document = await service.upload_document(project_id, file)
    
    # Process document in background
    if background_tasks:
        background_tasks.add_task(service.process_document, document.id)
    
    return document

@router.get("/projects/{project_id}/documents", response_model=List[Document])
async def get_documents(project_id: int, db: Session = Depends(get_db)):
    service = DocumentService(db)
    return await service.get_project_documents(project_id)

@router.get("/documents/{document_id}/status", response_model=ProcessingStatus)
async def get_processing_status(document_id: int, db: Session = Depends(get_db)):
    service = DocumentService(db)
    status = await service.get_document_status(document_id)
    if not status:
        raise HTTPException(status_code=404, detail="Document not found")
    return status

@router.get("/documents/{document_id}/requirements")
async def get_document_requirements(document_id: int, db: Session = Depends(get_db)):
    service = DocumentService(db)
    requirements = await service.get_document_requirements(document_id)
    if requirements is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"requirements": requirements}