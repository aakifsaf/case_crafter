from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class DocumentBase(BaseModel):
    filename: str

class DocumentCreate(DocumentBase):
    project_id: int

class Document(DocumentBase):
    id: int
    project_id: int
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    status: str
    uploaded_at: datetime
    processed_text: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

class ProcessingStatus(BaseModel):
    status: str
    progress: int
    message: str