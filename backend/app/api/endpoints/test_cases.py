from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.database import get_db
from app.services.test_service import TestService

router = APIRouter()

@router.post("/documents/{document_id}/generate-tests")
async def generate_test_cases(document_id: int, db: Session = Depends(get_db)):
    service = TestService(db)
    try:
        test_suite = await service.generate_test_cases(document_id)
        return test_suite
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects/{project_id}/test-suite")
async def get_project_test_suite(project_id: int, db: Session = Depends(get_db)):
    service = TestService(db)
    test_suites = await service.get_project_test_suites(project_id)
    return {"test_suites": test_suites}

@router.get("/projects/{project_id}/traceability-matrix")
async def get_traceability_matrix(project_id: int, db: Session = Depends(get_db)):
    service = TestService(db)
    matrix = await service.get_traceability_matrix(project_id)
    return matrix

@router.get("/test-suites/{test_suite_id}/export")
async def export_test_suite(test_suite_id: int, format: str = "excel", db: Session = Depends(get_db)):
    service = TestService(db)
    try:
        return await service.export_test_suite(test_suite_id, format)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))