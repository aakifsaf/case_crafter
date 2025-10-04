from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List

from app.models.database import get_db
from app.core.auth import get_current_user
from app.schemas.upload import UploadResponse
from app.services.upload_service import UploadService
from app.models.database import User

router = APIRouter()

@router.post("/upload/quick", response_model=UploadResponse)
async def quick_upload(
    file: UploadFile = File(...),
    project_name: str = Form(...),
    description: str = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    upload_service = UploadService(db)
    return await upload_service.quick_upload(file, project_name, description, current_user.id)

@router.post("/upload/bulk")
async def bulk_upload(
    files: List[UploadFile] = File(...),
    project_id: int = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    upload_service = UploadService(db)
    return await upload_service.bulk_upload(files, project_id, current_user.id)

@router.get("/upload/recent")
async def get_recent_uploads(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Implementation for recent uploads
    return {"message": "Recent uploads endpoint"}