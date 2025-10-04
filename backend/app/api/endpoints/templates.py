from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.database import get_db
from app.core.auth import get_current_user
from app.schemas.template import (
    TemplateCreate, TemplateUpdate, TemplateResponse, 
    TemplateApply, TemplateApplicationResponse
)
from app.services.template_service import TemplateService
from app.models.database import User

router = APIRouter()

@router.get("/templates", response_model=List[TemplateResponse])
async def get_templates(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template_service = TemplateService(db)
    templates = await template_service.get_templates(
        skip=skip, 
        limit=limit, 
        user_id=current_user.id
    )
    
    if category:
        templates = [t for t in templates if t.category == category]
    
    return templates

@router.post("/templates", response_model=TemplateResponse)
async def create_template(
    template_data: TemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template_service = TemplateService(db)
    return await template_service.create_template(template_data, current_user.id)

@router.get("/templates/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template_service = TemplateService(db)
    return await template_service.get_template(template_id)

@router.put("/templates/{template_id}", response_model=TemplateResponse)
async def update_template(
    template_id: int,
    template_data: TemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template_service = TemplateService(db)
    return await template_service.update_template(template_id, template_data, current_user.id)

@router.delete("/templates/{template_id}")
async def delete_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template_service = TemplateService(db)
    await template_service.delete_template(template_id, current_user.id)
    return {"message": "Template deleted successfully"}

@router.post("/templates/{template_id}/apply", response_model=TemplateApplicationResponse)
async def apply_template(
    template_id: int,
    apply_data: TemplateApply,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template_service = TemplateService(db)
    return await template_service.apply_template(
        template_id, 
        apply_data.project_id, 
        current_user.id
    )

@router.get("/templates/categories")
async def get_categories(db: Session = Depends(get_db)):
    template_service = TemplateService(db)
    return await template_service.get_categories()

@router.get("/templates/search")
async def search_templates(
    q: str = Query(..., min_length=1),
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template_service = TemplateService(db)
    return await template_service.search_templates(q, category, current_user.id)