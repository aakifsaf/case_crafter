from typing import List, Dict
import json
import re
import requests
import os
from dataclasses import dataclass
from .traceability_engine import TraceabilityEngine 
from app.models.database import Document
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

load_dotenv()

@dataclass
class AIConfig:
    api_key: str = os.getenv("GEMINI_API_KEY")
    base_url: str = "https://generativelanguage.googleapis.com/v1beta"
    model: str = "gemini-2.5-flash-lite"

class AdvancedTestGenerator:
    def __init__(self, db: Session, config: AIConfig = None):
        self.config = config or AIConfig()
        self.template_manager = TestTemplateManager()
        self.db = db
        
    def generate_test_suite(self, requirements: List[Dict], document_id: int) -> Dict:
        """Generate comprehensive test suite using ai model in a single API call"""
        try:
            document = self.db.query(Document).filter(Document.id == document_id).first()
            project_id = document.project_id if document else None
            # Generate everything in one API call
            ai_response = self._generate_complete_test_suite_ai(requirements)
            traceability_engine = TraceabilityEngine()
            
            test_suite = {
                'test_cases': ai_response.get('test_cases', []),
                'test_scenarios': ai_response.get('test_scenarios', []),
                'traceability_matrix': traceability_engine.build_traceability_matrix(requirements, ai_response.get('test_cases', []), project_id),
                'coverage_analysis': self._analyze_coverage(requirements, ai_response.get('test_cases', []))
            }
            
            return test_suite
            
        except Exception as e:
            print(f"AI test suite generation failed: {e}")
            return self._generate_fallback_test_suite(requirements)
    
    def _generate_complete_test_suite_ai(self, requirements: List[Dict]) -> Dict:
        """Generate complete test suite in a single API call"""
        prompt = self._create_complete_test_suite_prompt(requirements)
        response = self._call_ai(prompt)
        return json.loads(response)
    
    def _create_complete_test_suite_prompt(self, requirements: List[Dict]) -> str:
        """Create optimized prompt for complete test suite generation"""
        requirements_summary = json.dumps([
            {
                'id': req['id'],
                'text': req['original_text'],
                'type': req.get('type', 'functional')
            }
            for req in requirements
        ], indent=2)
        
        return f"""
        Generate a complete test suite for the following software requirements in a single response.
        
        REQUIREMENTS:
        {requirements_summary}
        
        Generate the complete test suite in this exact JSON format:
        {{
            "test_cases": [
                {{
                    "id": "1",
                    "requirement_id": "requirement_id_from_above",
                    "name": "descriptive test case name",
                    "description": "detailed description",
                    "test_type": "positive|negative|edge|security|performance",
                    "priority": "high|medium|low",
                    "test_steps": ["step1", "step2", "step3"],
                    "expected_results": "clear expected outcome",
                    "test_data": "data for testing in json format",
                    "preconditions": ["precondition1", "precondition2"],
                    "ai_generated": true
                }}
            ],
            "test_scenarios": [
                {{
                    "name": "integration scenario name",
                    "description": "end-to-end user journey description",
                    "test_cases": ["test_case_id1", "test_case_id2", ...],
                    "type": "integration|e2e|workflow",
                    "business_flow": "description of business process",
                    "success_criteria": ["criteria1", "criteria2"]
                }}
            ]
        }}
        
        IMPORTANT INSTRUCTIONS:
        1. Generate 3 test cases per requirement (mix of positive, negative, edge cases)
        2. Include security test cases for requirements that involve data handling, authentication, or user input
        3. Include performance test cases for requirements that involve data processing, calculations, or system resources
        4. Create integration scenarios that combine test cases from multiple requirements
        5. Ensure test steps are specific, actionable, and cover the business logic
        6. Assign appropriate priorities based on risk and importance
        7. Make sure test cases are traceable to specific requirement IDs
        
        For each requirement, generate:
        - At least 1 positive test cases (valid inputs, happy path)
        - At least 1 negative test cases (invalid inputs, error conditions)
        - At least 1 edge case (boundary values, unusual scenarios)
        - Security test cases if applicable
        - Performance test cases if applicable
        
        For integration scenarios, focus on:
        - Realistic user workflows
        - End-to-end business processes
        - Data flow between components
        - Cross-requirement functionality
        
        Ensure comprehensive coverage and realistic test scenarios.
        """
    
    def _build_traceability_matrix(self, test_cases: List[Dict]) -> Dict:
        """Build traceability matrix from test cases"""
        matrix = {}
        for test_case in test_cases:
            req_id = test_case.get('requirement_id')
            if req_id not in matrix:
                matrix[req_id] = []
            matrix[req_id].append(test_case.get('id'))
        return matrix
    
    def _analyze_coverage(self, requirements: List[Dict], test_cases: List[Dict]) -> Dict:
        """Enhanced coverage analysis"""
        total_requirements = len(requirements)
        
        # Get covered requirements from test cases
        covered_requirement_ids = set(tc.get('requirement_id') for tc in test_cases)
        covered_requirements = len(covered_requirement_ids)
        
        # Analyze coverage by requirement type
        requirement_types = {}
        for req in requirements:
            req_type = req.get('type', 'unknown')
            if req_type not in requirement_types:
                requirement_types[req_type] = {'total': 0, 'covered': 0}
            requirement_types[req_type]['total'] += 1
            if req['id'] in covered_requirement_ids:
                requirement_types[req_type]['covered'] += 1
        
        # Analyze test type distribution
        test_type_distribution = {}
        for test_case in test_cases:
            test_type = test_case.get('test_type', 'unknown')
            test_type_distribution[test_type] = test_type_distribution.get(test_type, 0) + 1
        
        return {
            'total_requirements': total_requirements,
            'covered_requirements': covered_requirements,
            'coverage_percentage': (covered_requirements / total_requirements * 100) if total_requirements > 0 else 0,
            'uncovered_requirements': [req['id'] for req in requirements if req['id'] not in covered_requirement_ids],
            'coverage_by_type': {
                req_type: {
                    'coverage_percentage': (data['covered'] / data['total'] * 100) if data['total'] > 0 else 0,
                    'covered': data['covered'],
                    'total': data['total']
                }
                for req_type, data in requirement_types.items()
            },
            'test_type_distribution': test_type_distribution,
            'total_test_cases': len(test_cases)
        }
    
    def _call_ai(self, prompt: str) -> str:
        """Call Google Gemini model via API"""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.config.api_key}"
        }

        # Gemini uses `contents` instead of `messages`
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": (
                            "You are an expert QA engineer specializing in creating comprehensive test suites. "
                            "Always respond with valid JSON. "
                            "Generate complete test suites including test cases and integration scenarios "
                            "in a single response.\n\n"
                            f"User prompt: {prompt}"
                        )}
                    ]
                }
            ]
        }

        try:
            # response = requests.post(
            #     f"{self.config.base_url}/models/{self.config.model}:generateContent",
            #     headers=headers,
            #     json=payload
            # )
            # response.raise_for_status()

            # data = response.json()
            # # Gemini responses: candidates[0].content.parts[0].text
            # return data["candidates"][0]["content"]["parts"][0]["text"]
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[  
                        "You are an expert QA engineer specializing in creating comprehensive test suites. "
                        "Always respond with valid JSON."
                        "Generate complete test suites including test cases and integration scenarios "
                        "in a single response.\n\n"
                        f"User prompt: {prompt}"
                    ],
                    config={
                        "response_mime_type": "application/json"
                    },
            )
            print("Gemini API response received:", response.text)
            return response.text

        except Exception as e:
            print(f"Gemini API error: {e}")
            raise
    
    def _generate_fallback_test_suite(self, requirements: List[Dict]) -> Dict:
        """Fallback test suite generation when AI fails"""
        test_cases = []
        test_case_id = 1
        
        for req in requirements:
            # Generate basic test cases for each requirement
            cases = self._generate_basic_test_cases(req, test_case_id)
            test_cases.extend(cases)
            test_case_id += len(cases)
        
        # Generate basic integration scenarios
        test_scenarios = self._generate_basic_integration_scenarios(test_cases)
        
        traceability_matrix = self._build_traceability_matrix(test_cases)
        coverage_analysis = self._analyze_coverage(requirements, test_cases)
        
        return {
            'test_cases': test_cases,
            'test_scenarios': test_scenarios,
            'traceability_matrix': traceability_matrix,
            'coverage_analysis': coverage_analysis
        }
    
    def _generate_basic_test_cases(self, requirement: Dict, start_id: int) -> List[Dict]:
        """Generate basic test cases as fallback"""
        cases = []
        current_id = start_id
        
        # Positive test case
        cases.append({
            'id': current_id,
            'requirement_id': requirement['id'],
            'name': f"Verify {requirement['original_text']}",
            'description': f"Validate successful execution: {requirement['original_text']}",
            'test_type': 'positive',
            'priority': 'high',
            'test_steps': [
                "Initialize test environment",
                "Prepare valid input data",
                "Execute functionality",
                "Verify results match expectations"
            ],
            'expected_results': f"System successfully implements: {requirement['original_text']}",
            'test_data': {'input_type': 'valid'},
            'preconditions': ["System is available", "Test data is prepared"],
            'ai_generated': False
        })
        current_id += 1
        
        # Negative test case
        cases.append({
            'id': current_id,
            'requirement_id': requirement['id'],
            'name': f"Verify {requirement['original_text']}",
            'description': f"Test error handling: {requirement['original_text']}",
            'test_type': 'negative',
            'priority': 'medium',
            'test_steps': [
                "Initialize test environment",
                "Prepare invalid input data",
                "Execute functionality with invalid data",
                "Verify proper error handling"
            ],
            'expected_results': "System handles invalid input gracefully with appropriate errors",
            'test_data': {'input_type': 'invalid'},
            'preconditions': ["System is operational"],
            'ai_generated': False
        })
        current_id += 1
        
        # Edge case
        cases.append({
            'id': current_id,
            'requirement_id': requirement['id'],
            'name': f"Verify {requirement['original_text']}",
            'description': f"Test boundary conditions: {requirement['original_text']}",
            'test_type': 'edge',
            'priority': 'low',
            'test_steps': [
                "Identify boundary conditions",
                "Prepare edge case test data",
                "Execute functionality",
                "Verify system stability"
            ],
            'expected_results': "System maintains stability under edge conditions",
            'test_data': {'edge_case': True},
            'preconditions': ["System is in stable state"],
            'ai_generated': False
        })
        
        return cases
    
    def _generate_basic_integration_scenarios(self, test_cases: List[Dict]) -> List[Dict]:
        """Generate basic integration scenarios as fallback"""
        if len(test_cases) < 3:
            return []
        
        return [{
            'name': 'Basic End-to-End Workflow',
            'description': 'Complete user journey testing main functionality',
            'test_cases': [tc['id'] for tc in test_cases[:3]],
            'type': 'integration',
            'business_flow': 'Basic workflow covering primary requirements',
            'success_criteria': ['All test cases pass', 'Data flows correctly']
        }]

class TestTemplateManager:
    """Enhanced template manager with AI suggestions"""
    
    def __init__(self):
        self.templates = {
            'positive': self._positive_template,
            'negative': self._negative_template,
            'edge': self._edge_template,
            'security': self._security_template,
            'performance': self._performance_template
        }
    
    def get_ai_enhanced_template(self, requirement: Dict, test_type: str) -> Dict:
        """Get AI-enhanced template for specific requirement"""
        base_template = self.templates.get(test_type, self._positive_template)(requirement)
        
        # Add AI-suggested enhancements
        if test_type == 'security':
            base_template['security_considerations'] = [
                "Input validation and sanitization",
                "Authentication and authorization checks",
                "Data encryption in transit and at rest",
                "Session management security"
            ]
        elif test_type == 'performance':
            base_template['performance_metrics'] = [
                "Response time under load",
                "Resource utilization",
                "Throughput capacity",
                "Concurrent user handling"
            ]
        
        return base_template
    
    def _positive_template(self, requirement: Dict) -> Dict:
        return {
            'name': f'Verify successful {requirement["original_text"]}',
            'type': 'positive',
            'priority': 'high',
            'focus_areas': ['happy path', 'valid inputs', 'expected outcomes']
        }
    
    def _negative_template(self, requirement: Dict) -> Dict:
        return {
            'name': f'Verify error handling for {requirement["original_text"]}',
            'type': 'negative',
            'priority': 'medium',
            'focus_areas': ['invalid inputs', 'error conditions', 'boundary violations']
        }
    
    def _edge_template(self, requirement: Dict) -> Dict:
        return {
            'name': f'Verify edge cases for {requirement["original_text"]}',
            'type': 'edge',
            'priority': 'medium',
            'focus_areas': ['boundary values', 'unusual scenarios', 'stress conditions']
        }
    
    def _security_template(self, requirement: Dict) -> Dict:
        return {
            'name': f'Security validation for {requirement["original_text"]}',
            'type': 'security',
            'priority': 'high',
            'focus_areas': ['authentication', 'authorization', 'data protection', 'input validation']
        }
    
    def _performance_template(self, requirement: Dict) -> Dict:
        return {
            'name': f'Performance testing for {requirement["original_text"]}',
            'type': 'performance',
            'priority': 'medium',
            'focus_areas': ['response time', 'load handling', 'resource usage', 'scalability']
        }