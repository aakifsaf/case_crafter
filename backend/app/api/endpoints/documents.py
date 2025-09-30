from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from app.services.document_service import DocumentService
from app.schemas.document_schemas import DocumentResponse, ProcessingStatus

router = APIRouter()
document_service = DocumentService()

@router.post("/projects/{project_id}/documents", response_model=DocumentResponse)
async def upload_document(
    project_id: int,
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    """Upload and process a BRD document"""
    try:
        document = await document_service.upload_document(project_id, file)
        
        # Process document in background
        background_tasks.add_task(
            document_service.process_document, 
            document.id
        )
        
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/documents/{document_id}/status")
async def get_processing_status(document_id: int) -> ProcessingStatus:
    """Get document processing status"""
    return await document_service.get_processing_status(document_id)

@router.get("/documents/{document_id}/requirements")
async def get_document_requirements(document_id: int):
    """Get extracted requirements from document"""
    return await document_service.get_requirements(document_id)

# backend/app/api/endpoints/test_cases.py
@router.post("/requirements/{requirement_id}/generate-tests")
async def generate_test_cases(requirement_id: int):
    """Generate test cases for a specific requirement"""
    return await document_service.generate_test_cases(requirement_id)

@router.get("/projects/{project_id}/test-suite")
async def get_project_test_suite(project_id: int):
    """Get complete test suite for a project"""
    return await document_service.get_test_suite(project_id)

@router.get("/projects/{project_id}/traceability-matrix")
async def get_traceability_matrix(project_id: int):
    """Get requirement-test case traceability matrix"""
    return await document_service.get_traceability_matrix(project_id)