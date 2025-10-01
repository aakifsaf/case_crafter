from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict
import json

class TraceabilityEngine:
    def __init__(self):
        try:
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        except:
            # Fallback if model not available
            self.embedding_model = None
        self.vector_store = {}  # Simple in-memory store
    
    def build_traceability_matrix(self, requirements: List[Dict], test_cases: List[Dict]) -> Dict:
        """Build and maintain bidirectional traceability"""
        matrix = {
            'requirements': [],
            'test_cases': [],
            'links': []
        }
        
        # Store requirements
        for req in requirements:
            matrix['requirements'].append({
                'id': req['id'],
                'text': req['original_text'],
                'type': req['type']
            })
        
        # Store test cases
        for tc in test_cases:
            matrix['test_cases'].append({
                'id': tc['id'],
                'name': tc['name'],
                'type': tc['test_type']
            })
            
            # Create traceability links
            if 'requirement_id' in tc:
                matrix['links'].append({
                    'requirement_id': tc['requirement_id'],
                    'test_case_id': tc['id'],
                    'strength': 'direct'
                })
        
        return matrix
    
    def find_impact_analysis(self, changed_requirement_id: str, traceability_matrix: Dict) -> List[int]:
        """Find all test cases impacted by a requirement change"""
        impacted_tests = []
        
        for link in traceability_matrix['links']:
            if link['requirement_id'] == changed_requirement_id:
                impacted_tests.append(link['test_case_id'])
        
        return list(set(impacted_tests))
    
    def _embed_requirements(self, requirements: List[Dict]) -> List[np.ndarray]:
        """Embed requirements using sentence transformers"""
        if not self.embedding_model:
            return []
            
        texts = [req['original_text'] for req in requirements]
        return self.embedding_model.encode(texts)
    
    def _embed_test_cases(self, test_cases: List[Dict]) -> List[np.ndarray]:
        """Embed test cases using sentence transformers"""
        if not self.embedding_model:
            return []
            
        texts = [f"{tc['name']} {tc.get('description', '')}" for tc in test_cases]
        return self.embedding_model.encode(texts)