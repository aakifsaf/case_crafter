from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
from typing import List, Dict
import json

class AdvancedTestGenerator:
    def __init__(self):
        self.test_generator = pipeline(
            "text-generation",
            model="microsoft/DialoGPT-medium",
            tokenizer="microsoft/DialoGPT-medium"
        )
        self.template_manager = TestTemplateManager()
    
    def generate_test_suite(self, requirements: List[Dict]) -> Dict:
        test_suite = {
            'test_cases': [],
            'test_scenarios': [],
            'traceability_matrix': {},
            'coverage_analysis': {}
        }
        
        for req in requirements:
            test_cases = self._generate_test_cases_for_requirement(req)
            test_suite['test_cases'].extend(test_cases)
            test_suite['traceability_matrix'][req['id']] = [
                tc['id'] for tc in test_cases
            ]
        
        test_suite['test_scenarios'] = self._generate_integration_scenarios(
            test_suite['test_cases']
        )
        test_suite['coverage_analysis'] = self._analyze_coverage(
            requirements, test_suite['traceability_matrix']
        )
        
        return test_suite
    
    def _generate_test_cases_for_requirement(self, requirement: Dict) -> List[Dict]:
        """Generate comprehensive test cases for a single requirement"""
        test_cases = []
        
        # Positive test cases
        positive_cases = self._generate_positive_cases(requirement)
        test_cases.extend(positive_cases)
        
        # Negative test cases
        negative_cases = self._generate_negative_cases(requirement)
        test_cases.extend(negative_cases)
        
        # Edge cases
        edge_cases = self._generate_edge_cases(requirement)
        test_cases.extend(edge_cases)
        
        # Security test cases (if applicable)
        if self._requires_security_testing(requirement):
            security_cases = self._generate_security_cases(requirement)
            test_cases.extend(security_cases)
        
        return test_cases
    
    def _generate_positive_cases(self, requirement: Dict) -> List[Dict]:
        """Generate positive path test cases"""
        prompt = f"""
        Generate positive test cases for this requirement: {requirement['original_text']}
        
        Include:
        1. Test case name
        2. Preconditions
        3. Test steps
        4. Expected results
        5. Test data
        
        Format as JSON.
        """
        
        response = self.test_generator(
            prompt,
            max_length=500,
            num_return_sequences=1,
            temperature=0.7
        )
        
        return self._parse_test_cases_response(response[0]['generated_text'])