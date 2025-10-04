from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.database import create_tables, get_db
from app.api.endpoints import projects, documents, test_cases, auth
from app.api.endpoints import analytics, upload, templates, settings as settings_router
from contextlib import asynccontextmanager
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and directories
    create_tables()
    print(f"🚀 {settings.PROJECT_NAME} API starting up...")
    yield
    # Shutdown
    print("🔴 API shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Test Case Generation API",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["authentication"])
app.include_router(projects.router, prefix=settings.API_V1_STR, tags=["projects"])
app.include_router(documents.router, prefix=settings.API_V1_STR, tags=["documents"])
app.include_router(test_cases.router, prefix=settings.API_V1_STR, tags=["test-cases"])
app.include_router(templates.router, prefix=settings.API_V1_STR, tags=["templates"])
app.include_router(analytics.router, prefix=settings.API_V1_STR, tags=["analytics"])
app.include_router(upload.router, prefix=settings.API_V1_STR, tags=["upload"])
app.include_router(settings_router.router, prefix=settings.API_V1_STR, tags=["settings"])


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )