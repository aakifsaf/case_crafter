from transformers import AutoTokenizer, AutoModelForTokenClassification
import spacy
from typing import List, Dict
import re

class RequirementAnalyzer:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        # Load custom requirement classification model
        self.tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
        self.model = AutoModelForTokenClassification.from_pretrained("bert-base-uncased")
    
    def analyze_requirements(self, requirements: List[str]) -> List[Dict]:
        analyzed_requirements = []
        
        for req in requirements:
            doc = self.nlp(req)
            
            analysis = {
                'original_text': req,
                'entities': self._extract_entities(doc),
                'type': self._classify_requirement_type(req),
                'complexity': self._assess_complexity(req),
                'dependencies': self._find_dependencies(req, requirements),
                'testability': self._assess_testability(req),
                'ambiguity_score': self._calculate_ambiguity(req)
            }
            analyzed_requirements.append(analysis)
        
        return analyzed_requirements
    
    def _extract_entities(self, doc) -> List[Dict]:
        """Extract key entities from requirement text"""
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
        
        if any(word in requirement_lower for word in ['shall', 'must', 'will', 'should']):
            return 'functional'
        elif any(word in requirement_lower for word in ['performance', 'security', 'usability']):
            return 'non_functional'
        elif any(word in requirement_lower for word in ['user', 'actor', 'role']):
            return 'user_requirement'
        else:
            return 'business_rule'