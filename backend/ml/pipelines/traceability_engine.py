import chromadb
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict

class TraceabilityEngine:
    def __init__(self):
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.client = chromadb.Client()
        self.collection = self.client.create_collection("traceability")
    
    def build_traceability_matrix(self, requirements: List[Dict], test_cases: List[Dict]):
        """Build and maintain bidirectional traceability"""
        
        # Embed requirements and test cases
        req_embeddings = self._embed_requirements(requirements)
        test_embeddings = self._embed_test_cases(test_cases)
        
        # Store in vector database
        self._store_in_vector_db(requirements, test_cases, req_embeddings, test_embeddings)
        
        # Create traceability matrix
        matrix = self._create_traceability_matrix(requirements, test_cases)
        
        return matrix
    
    def find_impact_analysis(self, changed_requirement_id: str):
        """Find all test cases impacted by a requirement change"""
        similar_requirements = self.collection.query(
            query_texts=[changed_requirement_id],
            n_results=5
        )
        
        impacted_tests = []
        for req_id in similar_requirements['ids'][0]:
            linked_tests = self._get_linked_test_cases(req_id)
            impacted_tests.extend(linked_tests)
        
        return list(set(impacted_tests))