from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.core.auth import get_current_user
from app.schemas.analytics import AnalyticsResponse, ProjectAnalyticsResponse
from app.services.analytics_service import AnalyticsService
from app.models.database import User

router = APIRouter()

@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    period: str = Query("30d", regex="^(7d|30d|90d|1y)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_analytics(current_user.id, period)

@router.get("/analytics/projects/{project_id}", response_model=ProjectAnalyticsResponse)
async def get_project_analytics(
    project_id: int,
    period: str = Query("30d", regex="^(7d|30d|90d|1y)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_project_analytics(project_id, current_user.id, period)

@router.get("/analytics/documents")
async def get_document_analytics(
    period: str = Query("30d", regex="^(7d|30d|90d|1y)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analytics_service = AnalyticsService(db)
    return {"message": "Document analytics endpoint"}

@router.get("/analytics/test-suites")
async def get_test_suite_analytics(
    period: str = Query("30d", regex="^(7d|30d|90d|1y)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analytics_service = AnalyticsService(db)
    return {"message": "Test suite analytics endpoint"}