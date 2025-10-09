import chromadb
from chromadb.config import Settings
import uuid
from typing import List, Dict, Any
import numpy as np
from sentence_transformers import SentenceTransformer

class TraceabilityEngine:
    def __init__(self, persist_directory: str = "./chroma_traceability"):
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Create collections
        self.requirements_collection = self._get_or_create_collection("requirements")
        self.test_cases_collection = self._get_or_create_collection("test_cases")
        self.traceability_links_collection = self._get_or_create_collection("traceability_links")
        
        print("ChromaDB Traceability Engine initialized")
    
    def _get_or_create_collection(self, name: str):
        """Get existing collection or create new one"""
        try:
            return self.client.get_collection(name)
        except:
            return self.client.create_collection(
                name=name,
                metadata={"description": f"{name} for traceability"}
            )
    
    def build_traceability_matrix(self, requirements: List[Dict], test_cases: List[Dict], project_id: int = None) -> Dict:
        """Build comprehensive traceability matrix using ChromaDB"""
        # Store requirements and test cases in ChromaDB
        self._store_requirements_in_chroma(requirements, project_id)
        self._store_test_cases_in_chroma(test_cases, project_id)
        
        # Create semantic links
        semantic_links = self._create_semantic_links(requirements, test_cases, project_id)
        
        # Build traditional traceability matrix
        matrix = {
            'requirements': [],
            'test_cases': [],
            'links': [],
            'semantic_links': semantic_links,
            'coverage_analysis': self._calculate_coverage_analysis(requirements, test_cases, semantic_links)
        }
        
        # Store requirements in matrix
        for req in requirements:
            matrix['requirements'].append({
                'id': req['id'],
                'text': req.get('original_text', ''),
                'type': req.get('type', 'unknown'),
                'priority': req.get('priority', 'medium')
            })
        
        # Store test cases in matrix
        for tc in test_cases:
            matrix['test_cases'].append({
                'id': tc['id'],
                'name': tc['name'],
                'type': tc.get('test_type', 'unknown'),
                'requirement_id': tc.get('requirement_id')
            })
            
            # Create direct traceability links
            if 'requirement_id' in tc:
                matrix['links'].append({
                    'requirement_id': tc['requirement_id'],
                    'test_case_id': tc['id'],
                    'link_type': 'direct',
                    'strength': 1.0
                })
        
        return matrix
    
    def _store_requirements_in_chroma(self, requirements: List[Dict], project_id: int = None):
        """Store requirements in ChromaDB with embeddings"""
        try:
            documents = []
            metadatas = []
            ids = []
            
            for req in requirements:
                req_id = req['id']
                req_text = req.get('cleaned_text', req.get('original_text', ''))
                
                documents.append(req_text)
                metadatas.append({
                    'requirement_id': req_id,
                    'project_id': project_id,
                    'type': req.get('type', 'unknown'),
                    'priority': req.get('priority', 'medium'),
                    'complexity': req.get('complexity', 0.5),
                    'quality_score': req.get('quality_score', 0.5)
                })
                ids.append(f"req_{project_id}_{req_id}")
            
            self.requirements_collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            
        except Exception as e:
            print(f"Error storing requirements in ChromaDB: {e}")
    
    def _store_test_cases_in_chroma(self, test_cases: List[Dict], project_id: int = None):
        """Store test cases in ChromaDB with embeddings"""
        try:
            documents = []
            metadatas = []
            ids = []
            
            for tc in test_cases:
                tc_id = tc['id']
                tc_text = f"{tc.get('name', '')} {tc.get('description', '')} {tc.get('expected_results', '')}"
                
                documents.append(tc_text)
                metadatas.append({
                    'test_case_id': tc_id,
                    'project_id': project_id,
                    'test_type': tc.get('test_type', 'unknown'),
                    'priority': tc.get('priority', 'medium'),
                    'requirement_id': tc.get('requirement_id', ''),
                    'ai_generated': tc.get('ai_generated', False)
                })
                ids.append(f"tc_{project_id}_{tc_id}")
            
            self.test_cases_collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            
        except Exception as e:
            print(f"Error storing test cases in ChromaDB: {e}")
    
    def _create_semantic_links(self, requirements: List[Dict], test_cases: List[Dict], project_id: int = None) -> List[Dict]:
        """Create semantic traceability links between requirements and test cases"""
        semantic_links = []
        
        try:
            for req in requirements:
                req_id = req['id']
                req_text = req.get('cleaned_text', req.get('original_text', ''))
                
                # Find semantically similar test cases
                similar_tests = self._find_similar_test_cases(req_text, n_results=5)
                
                for test_case in similar_tests:
                    # Only include if similarity is above threshold
                    if test_case['similarity'] > 0.3:  # Adjust threshold as needed
                        semantic_links.append({
                            'requirement_id': req_id,
                            'test_case_id': test_case['test_case_id'],
                            'similarity_score': test_case['similarity'],
                            'link_type': 'semantic',
                            'confidence': min(test_case['similarity'] * 1.5, 1.0)
                        })
                        
                        # Store the link in ChromaDB
                        link_id = f"link_{req_id}_{test_case['test_case_id']}"
                        self.traceability_links_collection.add(
                            documents=[f"Semantic link: {req_id} -> {test_case['test_case_id']}"],
                            metadatas=[{
                                'requirement_id': req_id,
                                'test_case_id': test_case['test_case_id'],
                                'similarity_score': test_case['similarity'],
                                'link_type': 'semantic',
                                'project_id': project_id
                            }],
                            ids=[link_id]
                        )
            
        except Exception as e:
            print(f"Error creating semantic links: {e}")
        
        return semantic_links
    
    def _find_similar_test_cases(self, query_text: str, n_results: int = 5) -> List[Dict]:
        """Find test cases semantically similar to query text"""
        try:
            results = self.test_cases_collection.query(
                query_texts=[query_text],
                n_results=n_results,
                include=['metadatas', 'distances']
            )
            
            similar_tests = []
            if results['metadatas'] and results['distances']:
                for metadata, distance in zip(results['metadatas'][0], results['distances'][0]):
                    similarity = 1 - (distance / 2)  # Convert distance to similarity
                    
                    similar_tests.append({
                        'test_case_id': metadata['test_case_id'],
                        'similarity': similarity,
                        'test_type': metadata['test_type']
                    })
            
            return similar_tests
            
        except Exception as e:
            print(f"Error finding similar test cases: {e}")
            return []
    
    def _calculate_coverage_analysis(self, requirements: List[Dict], test_cases: List[Dict], semantic_links: List[Dict]) -> Dict:
        """Calculate requirement coverage analysis"""
        total_requirements = len(requirements)
        
        # Find requirements with direct links
        requirements_with_direct_links = set()
        for tc in test_cases:
            if 'requirement_id' in tc:
                requirements_with_direct_links.add(tc['requirement_id'])
        
        # Find requirements with semantic links
        requirements_with_semantic_links = set(link['requirement_id'] for link in semantic_links)
        
        # Combined coverage
        all_covered_requirements = requirements_with_direct_links.union(requirements_with_semantic_links)
        
        return {
            'total_requirements': total_requirements,
            'direct_coverage': len(requirements_with_direct_links),
            'semantic_coverage': len(requirements_with_semantic_links),
            'total_coverage': len(all_covered_requirements),
            'coverage_percentage': (len(all_covered_requirements) / total_requirements * 100) if total_requirements > 0 else 0,
            'uncovered_requirements': [req['id'] for req in requirements if req['id'] not in all_covered_requirements]
        }
    
    def find_impact_analysis(self, changed_requirement_id: str, project_id: int = None) -> Dict:
        """Find all test cases impacted by a requirement change"""
        try:
            # Get direct links
            direct_links = self.traceability_links_collection.get(
                where={
                    'requirement_id': changed_requirement_id,
                    'link_type': 'direct',
                    'project_id': project_id
                } if project_id else {'requirement_id': changed_requirement_id, 'link_type': 'direct'}
            )
            
            # Get semantic links
            semantic_links = self.traceability_links_collection.get(
                where={
                    'requirement_id': changed_requirement_id,
                    'link_type': 'semantic',
                    'project_id': project_id
                } if project_id else {'requirement_id': changed_requirement_id, 'link_type': 'semantic'}
            )
            
            impacted_test_cases = set()
            
            # Add direct links
            for metadata in direct_links['metadatas']:
                impacted_test_cases.add(metadata['test_case_id'])
            
            # Add semantic links with high confidence
            for metadata in semantic_links['metadatas']:
                if metadata.get('similarity_score', 0) > 0.5:  # High confidence threshold
                    impacted_test_cases.add(metadata['test_case_id'])
            
            return {
                'requirement_id': changed_requirement_id,
                'impacted_test_cases': list(impacted_test_cases),
                'direct_impact_count': len(direct_links['metadatas']),
                'semantic_impact_count': len([m for m in semantic_links['metadatas'] if m.get('similarity_score', 0) > 0.5]),
                'total_impact_count': len(impacted_test_cases)
            }
            
        except Exception as e:
            print(f"Error in impact analysis: {e}")
            return {'requirement_id': changed_requirement_id, 'impacted_test_cases': []}
    
    def semantic_search_requirements(self, query: str, project_id: int = None, n_results: int = 10) -> List[Dict]:
        """Semantic search for requirements"""
        try:
            where_filter = {'project_id': project_id} if project_id else None
            
            results = self.requirements_collection.query(
                query_texts=[query],
                n_results=n_results,
                where=where_filter,
                include=['metadatas', 'documents', 'distances']
            )
            
            requirements = []
            if results['metadatas']:
                for metadata, document, distance in zip(
                    results['metadatas'][0], 
                    results['documents'][0], 
                    results['distances'][0]
                ):
                    similarity = 1 - (distance / 2)
                    
                    requirements.append({
                        'requirement_id': metadata['requirement_id'],
                        'text': document,
                        'type': metadata['type'],
                        'priority': metadata['priority'],
                        'similarity_score': similarity,
                        'project_id': metadata.get('project_id')
                    })
            
            return requirements
            
        except Exception as e:
            print(f"Error in semantic search: {e}")
            return []
    
    def get_project_traceability_matrix(self, project_id: int) -> Dict:
        """Get complete traceability matrix for a project"""
        try:
            # Get all requirements for project
            requirements_data = self.requirements_collection.get(
                where={'project_id': project_id},
                include=['metadatas', 'documents']
            )
            
            # Get all test cases for project
            test_cases_data = self.test_cases_collection.get(
                where={'project_id': project_id},
                include=['metadatas', 'documents']
            )
            
            # Get all traceability links for project
            links_data = self.traceability_links_collection.get(
                where={'project_id': project_id},
                include=['metadatas']
            )
            
            matrix = {
                'requirements': [],
                'test_cases': [],
                'links': []
            }
            
            # Build requirements list
            for metadata, document in zip(requirements_data['metadatas'], requirements_data['documents']):
                matrix['requirements'].append({
                    'id': metadata['requirement_id'],
                    'text': document,
                    'type': metadata['type'],
                    'priority': metadata['priority']
                })
            
            # Build test cases list
            for metadata, document in zip(test_cases_data['metadatas'], test_cases_data['documents']):
                matrix['test_cases'].append({
                    'id': metadata['test_case_id'],
                    'text': document,
                    'type': metadata['test_type'],
                    'priority': metadata['priority']
                })
            
            # Build links list
            for metadata in links_data['metadatas']:
                matrix['links'].append({
                    'requirement_id': metadata['requirement_id'],
                    'test_case_id': metadata['test_case_id'],
                    'link_type': metadata['link_type'],
                    'similarity_score': metadata.get('similarity_score', 1.0)
                })
            
            return matrix
            
        except Exception as e:
            print(f"Error getting project traceability matrix: {e}")
            return {'requirements': [], 'test_cases': [], 'links': []}