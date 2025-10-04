from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str = "functional"
    content: Dict[str, Any]
    is_public: bool = False

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    is_public: Optional[bool] = None

class TemplateResponse(TemplateBase):
    id: int
    user_id: int
    test_cases_count: int
    usage_count: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class TemplateApply(BaseModel):
    project_id: int

class TemplateApplicationResponse(BaseModel):
    id: int
    template_id: int
    project_id: int
    test_cases_created: int
    applied_at: datetime

    class Config:
        from_attributes = True