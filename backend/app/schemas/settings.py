from pydantic import BaseModel, EmailStr
from typing import Optional

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class NotificationSettings(BaseModel):
    email_notifications: bool = True
    project_updates: bool = True
    weekly_reports: bool = False

class Preferences(BaseModel):
    default_export_format: str = "excel"
    auto_process_documents: bool = True
    theme: str = "dark"