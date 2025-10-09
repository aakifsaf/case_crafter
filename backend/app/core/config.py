from pydantic_settings import BaseSettings
from typing import List, Optional
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    # Project
    PROJECT_NAME: str = "AUTOMAGIC QA"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str = "sqlite:///./case_crafter.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:5173",
    ]
    
    # AI/ML Services
    API_KEY: Optional[str] = None
    HUGGINGFACE_API_KEY: Optional[str] = None
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "uploads"
    
    # Redis (for Celery)
    REDIS_URL: str = "redis://localhost:6379"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()