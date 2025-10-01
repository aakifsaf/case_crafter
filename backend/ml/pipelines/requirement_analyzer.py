import spacy
from typing import List, Dict
import re

class RequirementAnalyzer:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            # Fallback if spaCy model not available
            self.nlp = None
    
    def analyze_requirements(self, requirements: List[str]) -> List[Dict]:
        analyzed_requirements = []
        
        for i, req in enumerate(requirements):
            analysis = {
                'id': i + 1,
                'original_text': req,
                'entities': self._extract_entities(req),
                'type': self._classify_requirement_type(req),
                'complexity': self._assess_complexity(req),
                'dependencies': [],
                'testability': self._assess_testability(req),
                'ambiguity_score': self._calculate_ambiguity(req)
            }
            analyzed_requirements.append(analysis)
        
        # Find dependencies between requirements
        for i, req in enumerate(analyzed_requirements):
            req['dependencies'] = self._find_dependencies(req, analyzed_requirements)
        
        return analyzed_requirements
    
    def _extract_entities(self, requirement: str) -> List[Dict]:
        """Extract key entities from requirement text"""
        if not self.nlp:
            return []
            
        doc = self.nlp(requirement)
        entities = []
        
        for ent in doc.ents:
            entities.append({
                'text': ent.text,
                'label': ent.label_,
                'start_char': ent.start_char,
                'end_char': ent.end_char
            })
        
        return entities
    
    def _classify_requirement_type(self, requirement: str) -> str:
        """Classify requirement as functional, non-functional, business rule, etc."""
        requirement_lower = requirement.lower()
        
        # Non-functional requirements
        nf_keywords = ['performance', 'security', 'usability', 'reliability', 'availability', 'maintainability']
        if any(keyword in requirement_lower for keyword in nf_keywords):
            return 'non_functional'
        
        # User requirements
        user_keywords = ['user', 'actor', 'role', 'person', 'customer']
        if any(keyword in requirement_lower for keyword in user_keywords):
            return 'user_requirement'
        
        # Functional requirements (contains action words)
        action_keywords = ['shall', 'must', 'will', 'should']
        if any(keyword in requirement_lower for keyword in action_keywords):
            return 'functional'
        
        # Default to business rule
        return 'business_rule'
    
    def _assess_complexity(self, requirement: str) -> int:
        """Assess complexity of requirement (1-5 scale)"""
        words = requirement.split()
        
        # Simple heuristics for complexity
        score = 1
        
        if len(words) > 20:
            score += 1
        if any(word in requirement.lower() for word in ['if', 'when', 'unless']):
            score += 1
        if any(word in requirement.lower() for word in ['and', 'or', 'but']):
            score += 1
        if any(word in requirement.lower() for word in ['all', 'every', 'each']):
            score += 1
        
        return min(score, 5)  # Cap at 5
    
    def _find_dependencies(self, current_req: Dict, all_requirements: List[Dict]) -> List[int]:
        """Find dependencies between requirements"""
        dependencies = []
        current_text = current_req['original_text'].lower()
        
        for other_req in all_requirements:
            if other_req['id'] == current_req['id']:
                continue
                
            other_text = other_req['original_text'].lower()
            
            # Simple dependency detection
            shared_terms = set(current_text.split()) & set(other_text.split())
            if len(shared_terms) > 2:  # If they share more than 2 terms
                dependencies.append(other_req['id'])
        
        return dependencies
    
    def _assess_testability(self, requirement: str) -> int:
        """Assess how testable a requirement is (1-5 scale)"""
        score = 3  # Base score
        
        # Positive indicators
        if any(word in requirement.lower() for word in ['validate', 'verify', 'check', 'ensure']):
            score += 1
        if any(word in requirement.lower() for word in ['input', 'output', 'result', 'response']):
            score += 1
        
        # Negative indicators
        if any(word in requirement.lower() for word in ['may', 'could', 'might', 'approximately']):
            score -= 1
        if len(requirement.split()) < 5:  # Too vague
            score -= 1
        
        return max(1, min(score, 5))
    
    def _calculate_ambiguity(self, requirement: str) -> float:
        """Calculate ambiguity score (0-1, where 1 is most ambiguous)"""
        score = 0.0
        
        # Ambiguity indicators
        ambiguous_terms = ['may', 'could', 'might', 'approximately', 'about', 'roughly', 'usually']
        for term in ambiguous_terms:
            if term in requirement.lower():
                score += 0.1
        
        # Sentence structure indicators
        if requirement.count(',') > 2:
            score += 0.2
        if len(requirement.split()) > 30:
            score += 0.1
        
        return min(score, 1.0)