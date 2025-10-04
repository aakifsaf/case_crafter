from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.database import User
from app.services.auth_service import AuthService

class SettingsService:
    def __init__(self, db: Session):
        self.db = db
        self.auth_service = AuthService(db)

    async def update_profile(self, user_id: int, profile_data) -> User:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        update_data = profile_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        return user

    async def change_password(self, user_id: int, password_data) -> bool:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify current password
        if not self.auth_service.verify_password(password_data.current_password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Update password
        user.hashed_password = self.auth_service.get_password_hash(password_data.new_password)
        self.db.commit()
        return True

    async def get_preferences(self, user_id: int) -> dict:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user.preferences or {}

    async def update_preferences(self, user_id: int, preferences: dict) -> dict:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.preferences = preferences
        self.db.commit()
        self.db.refresh(user)
        return user.preferences