from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    user_id: int 
    created_at: datetime
    updated_at: datetime  # FIX: Remove Optional, always required
    
    @validator('updated_at', pre=True, always=True)
    def set_updated_at(cls, v, values):
        # If updated_at is None, use created_at
        if v is None and 'created_at' in values:
            return values['created_at']
        return v
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }