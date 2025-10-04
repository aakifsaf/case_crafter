from pydantic import BaseModel
from typing import Optional

class QuickUploadRequest(BaseModel):
    project_name: str
    description: Optional[str] = None

class UploadResponse(BaseModel):
    upload_id: str
    status: str
    project_id: int
    document_id: int
    message: str