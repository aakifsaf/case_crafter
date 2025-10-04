from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class AnalyticsBase(BaseModel):
    period: str

class AnalyticsResponse(BaseModel):
    total_projects: int
    documents_analyzed: int
    test_cases_generated: int
    avg_processing_time: float
    recent_activity: List[Dict[str, Any]]
    projects_overview: Dict[str, Any]
    test_cases_by_type: Dict[str, int]

    class Config:
        from_attributes = True

class ProjectAnalyticsResponse(BaseModel):
    project_id: int
    project_name: str
    documents_count: int
    test_suites_count: int
    test_cases_count: int
    recent_activity: List[Dict[str, Any]]

class ActivityRecord(BaseModel):
    type: str
    description: str
    timestamp: str
    project_name: str