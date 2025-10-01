from typing import List, Dict
import json
import re

class AdvancedTestGenerator:
    def __init__(self):
        # In production, you would load actual ML models here
        # For now, we'll use rule-based generation
        self.template_manager = TestTemplateManager()
    
    def generate_test_suite(self, requirements: List[Dict]) -> Dict:
        test_suite = {
            'test_cases': [],
            'test_scenarios': [],
            'traceability_matrix': {},
            'coverage_analysis': {}
        }
        
        test_case_id = 1
        for req in requirements:
            test_cases = self._generate_test_cases_for_requirement(req, test_case_id)
            test_suite['test_cases'].extend(test_cases)
            test_suite['traceability_matrix'][req['id']] = [
                tc['id'] for tc in test_cases
            ]
            test_case_id += len(test_cases)
        
        test_suite['test_scenarios'] = self._generate_integration_scenarios(test_suite['test_cases'])
        test_suite['coverage_analysis'] = self._analyze_coverage(requirements, test_suite['traceability_matrix'])
        
        return test_suite
    
    def _generate_test_cases_for_requirement(self, requirement: Dict, start_id: int) -> List[Dict]:
        """Generate comprehensive test cases for a single requirement"""
        test_cases = []
        current_id = start_id
        
        # Positive test cases
        positive_cases = self._generate_positive_cases(requirement, current_id)
        test_cases.extend(positive_cases)
        current_id += len(positive_cases)
        
        # Negative test cases
        negative_cases = self._generate_negative_cases(requirement, current_id)
        test_cases.extend(negative_cases)
        current_id += len(negative_cases)
        
        # Edge cases
        edge_cases = self._generate_edge_cases(requirement, current_id)
        test_cases.extend(edge_cases)
        current_id += len(edge_cases)
        
        # Security test cases (if applicable)
        if self._requires_security_testing(requirement):
            security_cases = self._generate_security_cases(requirement, current_id)
            test_cases.extend(security_cases)
        
        return test_cases
    
    def _generate_positive_cases(self, requirement: Dict, start_id: int) -> List[Dict]:
        """Generate positive path test cases"""
        test_cases = []
        
        base_name = f"Verify {requirement['original_text'][:50]}..."
        
        test_case = {
            'id': start_id,
            'requirement_id': requirement['id'],
            'name': f"{base_name} - Positive Flow",
            'description': f"Positive test case for: {requirement['original_text']}",
            'test_type': 'positive',
            'priority': 'high',
            'test_steps': [
                "Set up test environment",
                "Prepare valid test data",
                "Execute the functionality",
                "Verify expected behavior"
            ],
            'expected_results': f"The system should {requirement['original_text']}",
            'test_data': {'status': 'valid'}
        }
        test_cases.append(test_case)
        
        return test_cases
    
    def _generate_negative_cases(self, requirement: Dict, start_id: int) -> List[Dict]:
        """Generate negative path test cases"""
        test_cases = []
        
        base_name = f"Verify {requirement['original_text'][:50]}..."
        
        # Invalid input test
        test_case = {
            'id': start_id,
            'requirement_id': requirement['id'],
            'name': f"{base_name} - Invalid Input",
            'description': f"Negative test case with invalid input for: {requirement['original_text']}",
            'test_type': 'negative',
            'priority': 'medium',
            'test_steps': [
                "Set up test environment",
                "Prepare invalid test data",
                "Execute the functionality",
                "Verify error handling"
            ],
            'expected_results': "System should handle invalid input gracefully and show appropriate error message",
            'test_data': {'status': 'invalid'}
        }
        test_cases.append(test_case)
        
        return test_cases
    
    def _generate_edge_cases(self, requirement: Dict, start_id: int) -> List[Dict]:
        """Generate edge case test cases"""
        test_cases = []
        
        base_name = f"Verify {requirement['original_text'][:50]}..."
        
        # Boundary test
        test_case = {
            'id': start_id,
            'requirement_id': requirement['id'],
            'name': f"{base_name} - Boundary Conditions",
            'description': f"Edge case testing boundary conditions for: {requirement['original_text']}",
            'test_type': 'edge',
            'priority': 'medium',
            'test_steps': [
                "Set up test environment",
                "Prepare boundary value test data",
                "Execute the functionality",
                "Verify boundary condition handling"
            ],
            'expected_results': "System should handle boundary values correctly",
            'test_data': {'boundary': 'min_max_values'}
        }
        test_cases.append(test_case)
        
        return test_cases
    
    def _generate_security_cases(self, requirement: Dict, start_id: int) -> List[Dict]:
        """Generate security test cases"""
        test_cases = []
        
        if any(word in requirement['original_text'].lower() for word in ['login', 'auth', 'password', 'user']):
            test_case = {
                'id': start_id,
                'requirement_id': requirement['id'],
                'name': f"Security Test for {requirement['original_text'][:30]}",
                'description': f"Security validation for: {requirement['original_text']}",
                'test_type': 'security',
                'priority': 'high',
                'test_steps': [
                    "Attempt SQL injection",
                    "Test for XSS vulnerabilities",
                    "Verify input sanitization",
                    "Check authentication bypass"
                ],
                'expected_results': "System should prevent security vulnerabilities and maintain data integrity",
                'test_data': {'security_test': True}
            }
            test_cases.append(test_case)
        
        return test_cases
    
    def _requires_security_testing(self, requirement: Dict) -> bool:
        """Check if requirement needs security testing"""
        security_keywords = ['login', 'auth', 'password', 'user', 'admin', 'privilege', 'access']
        return any(keyword in requirement['original_text'].lower() for keyword in security_keywords)
    
    def _generate_integration_scenarios(self, test_cases: List[Dict]) -> List[Dict]:
        """Generate integration test scenarios"""
        scenarios = []
        
        if len(test_cases) >= 2:
            scenario = {
                'name': 'Integrated User Flow',
                'description': 'Test complete user journey across multiple requirements',
                'test_cases': [tc['id'] for tc in test_cases[:3]],  # Use first 3 test cases
                'type': 'integration'
            }
            scenarios.append(scenario)
        
        return scenarios
    
    def _analyze_coverage(self, requirements: List[Dict], traceability_matrix: Dict) -> Dict:
        """Analyze test coverage"""
        total_requirements = len(requirements)
        covered_requirements = len([req_id for req_id in traceability_matrix if traceability_matrix[req_id]])
        
        return {
            'total_requirements': total_requirements,
            'covered_requirements': covered_requirements,
            'coverage_percentage': (covered_requirements / total_requirements * 100) if total_requirements > 0 else 0,
            'uncovered_requirements': [req['id'] for req in requirements if not traceability_matrix.get(req['id'])]
        }

class TestTemplateManager:
    """Manage test case templates"""
    def __init__(self):
        self.templates = {
            'positive': self._positive_template,
            'negative': self._negative_template,
            'edge': self._edge_template,
            'security': self._security_template
        }
    
    def _positive_template(self, requirement: str) -> Dict:
        return {
            'name': f'Verify {requirement[:30]}...',
            'type': 'positive',
            'priority': 'high'
        }
    
    def _negative_template(self, requirement: str) -> Dict:
        return {
            'name': f'Verify error handling for {requirement[:30]}...',
            'type': 'negative',
            'priority': 'medium'
        }
    
    def _edge_template(self, requirement: str) -> Dict:
        return {
            'name': f'Verify boundary conditions for {requirement[:30]}...',
            'type': 'edge',
            'priority': 'medium'
        }
    
    def _security_template(self, requirement: str) -> Dict:
        return {
            'name': f'Security test for {requirement[:30]}...',
            'type': 'security',
            'priority': 'high'
        }