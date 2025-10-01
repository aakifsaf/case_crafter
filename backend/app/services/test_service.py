from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.models.database import Document, Requirement, TestCase, TestSuite, Project
from ml.pipelines.test_generator import AdvancedTestGenerator
from ml.pipelines.traceability_engine import TraceabilityEngine
import json
from fastapi.responses import FileResponse
import pandas as pd
import tempfile
import os

class TestService:
    def __init__(self, db: Session):
        self.db = db
        self.test_generator = AdvancedTestGenerator()
        self.traceability_engine = TraceabilityEngine()

    async def generate_test_cases(self, document_id: int) -> Dict[str, Any]:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise Exception("Document not found")

        # Get requirements for this document
        requirements = self.db.query(Requirement).filter(Requirement.document_id == document_id).all()
        
        if not requirements:
            raise Exception("No requirements found for this document")

        # Convert to format expected by test generator
        requirement_data = [{
            "id": req.id,
            "original_text": req.original_text,
            "type": req.requirement_type,
            "complexity": req.complexity_score,
            "analysis": req.analysis_result
        } for req in requirements]

        # Generate test suite
        test_suite = self.test_generator.generate_test_suite(requirement_data)

        # Create test suite record
        db_test_suite = TestSuite(
            document_id=document_id,
            name=f"Test Suite for {document.filename}",
            description=f"Automatically generated test suite"
        )
        self.db.add(db_test_suite)
        self.db.commit()
        self.db.refresh(db_test_suite)

        # Save test cases
        for test_case_data in test_suite['test_cases']:
            db_test_case = TestCase(
                test_suite_id=db_test_suite.id,
                requirement_id=test_case_data.get('requirement_id'),
                name=test_case_data['name'],
                description=test_case_data.get('description'),
                test_steps=test_case_data.get('test_steps', []),
                expected_results=test_case_data.get('expected_results'),
                test_data=test_case_data.get('test_data', {}),
                test_type=test_case_data.get('test_type', 'positive'),
                priority=test_case_data.get('priority', 'medium')
            )
            self.db.add(db_test_case)

        self.db.commit()

        # Build traceability matrix
        traceability_matrix = self.traceability_engine.build_traceability_matrix(
            requirement_data, test_suite['test_cases']
        )

        return {
            "test_suite": {
                "id": db_test_suite.id,
                "name": db_test_suite.name,
                "document_name": document.filename,
                "test_cases": test_suite['test_cases']
            },
            "traceability_matrix": traceability_matrix
        }

    async def get_project_test_suites(self, project_id: int) -> List[Dict[str, Any]]:
        # Get all documents for the project
        documents = self.db.query(Document).filter(Document.project_id == project_id).all()
        document_ids = [doc.id for doc in documents]

        # Get test suites for these documents
        test_suites = self.db.query(TestSuite).filter(TestSuite.document_id.in_(document_ids)).all()
        
        result = []
        for suite in test_suites:
            test_cases = self.db.query(TestCase).filter(TestCase.test_suite_id == suite.id).all()
            result.append({
                "id": suite.id,
                "name": suite.name,
                "document_name": suite.document.filename,
                "created_at": suite.created_at.isoformat(),
                "test_cases": [{
                    "id": tc.id,
                    "name": tc.name,
                    "test_type": tc.test_type,
                    "priority": tc.priority
                } for tc in test_cases]
            })
        
        return result

    async def get_traceability_matrix(self, project_id: int) -> Dict[str, Any]:
        # Get all requirements and test cases for the project
        documents = self.db.query(Document).filter(Document.project_id == project_id).all()
        
        requirements = []
        test_cases = []
        
        for doc in documents:
            doc_requirements = self.db.query(Requirement).filter(Requirement.document_id == doc.id).all()
            for req in doc_requirements:
                req_test_cases = self.db.query(TestCase).filter(TestCase.requirement_id == req.id).all()
                requirements.append({
                    "id": req.id,
                    "text": req.original_text,
                    "test_cases": [tc.id for tc in req_test_cases]
                })
                test_cases.extend([{
                    "id": tc.id,
                    "name": tc.name,
                    "type": tc.test_type
                } for tc in req_test_cases])
        
        return {
            "requirements": requirements,
            "test_cases": test_cases
        }

    async def export_test_suite(self, test_suite_id: int, format: str = "excel"):
        test_suite = self.db.query(TestSuite).filter(TestSuite.id == test_suite_id).first()
        if not test_suite:
            raise Exception("Test suite not found")

        test_cases = self.db.query(TestCase).filter(TestCase.test_suite_id == test_suite_id).all()

        if format == "excel":
            return await self._export_to_excel(test_suite, test_cases)
        elif format == "json":
            return await self._export_to_json(test_suite, test_cases)
        else:
            raise Exception("Unsupported export format")

    async def _export_to_excel(self, test_suite, test_cases):
        # Create DataFrame
        data = []
        for tc in test_cases:
            data.append({
                "Test Case ID": tc.id,
                "Name": tc.name,
                "Description": tc.description or "",
                "Test Type": tc.test_type,
                "Priority": tc.priority,
                "Test Steps": "\n".join(tc.test_steps) if tc.test_steps else "",
                "Expected Results": tc.expected_results or "",
                "Test Data": str(tc.test_data) if tc.test_data else ""
            })

        df = pd.DataFrame(data)
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
            df.to_excel(tmp_file.name, index=False, sheet_name='Test Cases')
            return FileResponse(
                tmp_file.name,
                filename=f"{test_suite.name.replace(' ', '_')}_test_cases.xlsx",
                media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )

    async def _export_to_json(self, test_suite, test_cases):
        export_data = {
            "test_suite": {
                "name": test_suite.name,
                "document": test_suite.document.filename,
                "created_at": test_suite.created_at.isoformat()
            },
            "test_cases": [{
                "id": tc.id,
                "name": tc.name,
                "description": tc.description,
                "test_type": tc.test_type,
                "priority": tc.priority,
                "test_steps": tc.test_steps,
                "expected_results": tc.expected_results,
                "test_data": tc.test_data
            } for tc in test_cases]
        }
        
        return export_data