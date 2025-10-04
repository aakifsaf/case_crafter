from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.core.auth import get_current_user
from app.schemas.settings import (
    ProfileUpdate, PasswordChange, 
    NotificationSettings, Preferences
)
from app.services.settings_service import SettingsService
from app.models.database import User

router = APIRouter()

@router.put("/settings/profile")
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings_service = SettingsService(db)
    return await settings_service.update_profile(current_user.id, profile_data)

@router.put("/settings/password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings_service = SettingsService(db)
    await settings_service.change_password(current_user.id, password_data)
    return {"message": "Password updated successfully"}

@router.get("/settings/preferences")
async def get_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings_service = SettingsService(db)
    return await settings_service.get_preferences(current_user.id)

@router.put("/settings/preferences")
async def update_preferences(
    preferences: Preferences,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings_service = SettingsService(db)
    return await settings_service.update_preferences(current_user.id, preferences.dict())

@router.get("/settings/usage")
async def get_usage(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Implementation for usage statistics
    return {"message": "Usage statistics endpoint"}