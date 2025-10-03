from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.auth_schemas import UserLogin, UserRegister, Token, UserResponse , TokenResponse
from app.services.auth_service import AuthService
from app.models.database import get_db
from app.core.auth import get_current_user
from app.models.database import User

router = APIRouter()

@router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    
    # Create user
    user = await auth_service.create_user(
        email=user_data.email,
        password=user_data.password,
        name=user_data.name
    )
    
    # Create tokens
    access_token = auth_service.create_access_token(data={"sub": user.email})
    refresh_token = auth_service.create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }

@router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    
    # Authenticate user
    user = await auth_service.authenticate_user(user_data.email, user_data.password)
    
    # Create tokens
    access_token = auth_service.create_access_token(data={"sub": user.email})
    refresh_token = auth_service.create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    
    # Verify refresh token
    payload = auth_service.verify_token(refresh_token)
    
    if payload.get("type") != "refresh_token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    email = payload.get("sub")
    user = await auth_service.get_user_by_email(email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Create new tokens
    new_access_token = auth_service.create_access_token(data={"sub": user.email})
    new_refresh_token = auth_service.create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }

@router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )

@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    
    await auth_service.change_password(current_user, current_password, new_password)
    
    return {"message": "Password changed successfully"}

@router.post("/logout")
async def logout():
    # In a production system, you might want to blacklist the token
    # For now, we'll rely on token expiration
    return {"message": "Logged out successfully"}