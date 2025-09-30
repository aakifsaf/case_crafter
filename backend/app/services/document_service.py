from celery import Celery
from app.core.config import settings
from ml.pipelines.document_processor import AdvancedDocumentProcessor
from ml.pipelines.requirement_analyzer import RequirementAnalyzer
from ml.pipelines.test_generator import AdvancedTestGenerator
from app.services import storage_service

celery_app = Celery(
    'case_crafter',
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

@celery_app.task
def process_document_task(document_id: int):
    """Background task to process document"""
    try:
        # Document processing logic
        document_processor = AdvancedDocumentProcessor()
        requirement_analyzer = RequirementAnalyzer()
        test_generator = AdvancedTestGenerator()
        
        # Process document
        processed_data = document_processor.process_document(document_id)
        
        # Analyze requirements
        requirements = requirement_analyzer.analyze_requirements(
            processed_data['requirements']
        )
        
        # Generate test cases
        test_suite = test_generator.generate_test_suite(requirements)
        
        # Store results
        storage_service.store_analysis_results(
            document_id, requirements, test_suite
        )
        
        return {"status": "completed", "document_id": document_id}
        
    except Exception as e:
        return {"status": "failed", "error": str(e)}