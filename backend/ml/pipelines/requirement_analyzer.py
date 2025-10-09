import re
import spacy
import numpy as np
from typing import List, Dict, Tuple, Optional, Set
from dataclasses import dataclass
from collections import defaultdict, Counter
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import logging
from pathlib import Path
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Requirement:
    id: str
    original_text: str
    cleaned_text: str
    requirement_type: str
    priority: str
    complexity: float
    testability: float
    ambiguity: float
    specificity: float
    entities: List[Tuple[str, str]]
    key_phrases: List[str]
    dependencies: List[str]
    risks: List[str]
    quality_score: float
    format_detected: str
    section: str
    metadata: Dict[str, str]

class SemanticRequirementAnalyzer:
    """
    Production-ready BRD processor that handles any format with comprehensive analysis
    """
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        try:
            self.nlp = spacy.load("en_core_web_sm")
            self.sentence_model = SentenceTransformer(model_name)
            self._initialize_patterns()
            self._initialize_classifiers()
            logger.info("BRD Processor initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize BRD Processor: {e}")
            raise
    
    def _initialize_patterns(self):
        """Initialize comprehensive pattern matching"""
        # Requirement ID patterns
        self.id_patterns = [
            r'(REQ-\d+(?:-[A-Z]+-\d+)?)',  # REQ-001, REQ-SEC-001
            r'(FR-\d+(?:-[A-Z]+-\d+)?)',   # FR-001
            r'(NFR-\d+)',                   # NFR-001
            r'(BR-\d+)',                    # BR-001
            r'(UC-\d+)',                    # UC-001
            r'(S-\d+)',                     # S-001
            r'(\d+\.\d+(?:\.\d+)?)',       # 1.1, 1.1.1
            r'(\[R-\d+\])',                 # [R-001]
            r'(Requirement\s+\d+)',         # Requirement 1
        ]
        
        # Section headers
        self.section_patterns = [
            r'#+\s*(.*?)(?=\n|$)',
            r'\d+\.\d*\s*(.*?)(?=\n|$)',
            r'^(?:FUNCTIONAL|NON-FUNCTIONAL|BUSINESS|TECHNICAL)\s+REQUIREMENTS',
            r'^REQUIREMENTS?\s*$',
            r'^SPECIFICATIONS?\s*$',
            r'^SCOPE\s*$',
        ]
        
        # Metadata patterns
        self.metadata_patterns = {
            'priority': r'Priority:\s*(\w+)',
            'type': r'Type:\s*(\w+)',
            'description': r'Description:\s*(.*?)(?=\n\w+:|$)',
            'source': r'Source:\s*(\w+)',
            'status': r'Status:\s*(\w+)',
            'owner': r'Owner:\s*(\w+)',
        }
    
    def _initialize_classifiers(self):
        """Initialize requirement classification systems"""
        self.type_classifiers = {
            'security': [
                'security', 'authentication', 'authorization', 'encryption', 'access control',
                'password', 'login', 'session', 'ssl', 'tls', 'pci', 'gdpr', 'compliance',
                'audit', 'permission', 'role', 'privilege', 'secure', 'protection'
            ],
            'performance': [
                'performance', 'response time', 'throughput', 'latency', 'concurrent',
                'load', 'scalability', 'efficiency', 'speed', 'milliseconds', 'seconds',
                'users', 'transactions', 'capacity', 'benchmark'
            ],
            'ui': [
                'user interface', 'ui', 'ux', 'screen', 'page', 'display', 'layout',
                'button', 'menu', 'navigation', 'responsive', 'mobile', 'desktop',
                'theme', 'color', 'font', 'icon', 'click', 'hover', 'scroll'
            ],
            'data': [
                'database', 'data', 'storage', 'persistence', 'crud', 'create', 'read',
                'update', 'delete', 'query', 'export', 'import', 'backup', 'recovery',
                'migration', 'validation', 'integrity', 'consistency'
            ],
            'integration': [
                'api', 'integration', 'interface', 'service', 'endpoint', 'rest', 'soap',
                'web service', 'microservice', 'synchronization', 'message', 'queue',
                'event', 'webhook', 'callback', 'connector'
            ],
            'reporting': [
                'report', 'reporting', 'analytics', 'dashboard', 'metric', 'statistic',
                'chart', 'graph', 'visualization', 'export', 'download', 'print',
                'kpi', 'measurement', 'monitoring', 'log'
            ],
            'business': [
                'business rule', 'workflow', 'process', 'approval', 'notification',
                'escalation', 'compliance', 'regulation', 'policy', 'rule engine'
            ]
        }
        
        self.priority_indicators = {
            'critical': ['critical', 'must', 'shall', 'essential', 'mandatory', 'blocker'],
            'high': ['high', 'important', 'required', 'necessary', 'key'],
            'medium': ['medium', 'standard', 'normal', 'typical'],
            'low': ['low', 'nice to have', 'optional', 'enhancement']
        }
    
    def extract_requirements(self, text: str, brd_name: str = "unknown") -> List[Dict]:
        """
        Main method to process any BRD format
        """
        try:
            logger.info(f"Processing BRD: {brd_name}")
            
            # Pre-process text
            cleaned_text = self._preprocess_text(text)
            
            # Detect document structure
            document_structure = self._analyze_document_structure(cleaned_text)
            
            # Extract requirements using multi-strategy approach
            raw_requirements = self._multi_strategy_extraction(cleaned_text, document_structure)
            
            # Remove duplicates
            unique_requirements = self._deduplicate_requirements(raw_requirements)
            
            # Analyze requirements
            analyzed_requirements = []
            for i, req_data in enumerate(unique_requirements):
                requirement = self._deep_analyze_requirement(req_data, i + 1)
                analyzed_requirements.append(requirement)
            
            logger.info(f"Successfully processed {len(analyzed_requirements)} requirements")
            return analyzed_requirements
            
        except Exception as e:
            logger.error(f"Error processing BRD {brd_name}: {e}")
            return []
    
    def _preprocess_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove excessive whitespace but preserve structure
        text = re.sub(r' +', ' ', text)
        text = re.sub(r'\t+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Fix common encoding issues
        text = text.replace('�', '').replace('�', '"').replace('�', '"')
        
        return text.strip()
    
    def _analyze_document_structure(self, text: str) -> Dict:
        """Analyze document structure and sections"""
        structure = {
            'sections': [],
            'formats_detected': set(),
            'requirement_density': 0,
            'document_quality': 0
        }
        
        # Detect sections
        lines = text.split('\n')
        current_section = "Main"
        sections = defaultdict(list)
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Check if line is a section header
            is_section = False
            for pattern in self.section_patterns:
                match = re.match(pattern, line, re.IGNORECASE)
                if match:
                    current_section = match.group(1) if match.groups() else line
                    structure['sections'].append(current_section)
                    is_section = True
                    break
            
            if not is_section and len(line) > 10:  # Meaningful content
                sections[current_section].append(line)
        
        # Detect formats
        text_lower = text.lower()
        if any(pattern in text_lower for pattern in ['req-', 'fr-', 'nfr-']):
            structure['formats_detected'].add('formal')
        if re.search(r'\d+\.\s+[A-Z]', text):
            structure['formats_detected'].add('numbered')
        if any(pattern in text_lower for pattern in ['as a', 'i want', 'so that']):
            structure['formats_detected'].add('user_story')
        if any(pattern in text_lower for pattern in ['|', 'table', 'grid']):
            structure['formats_detected'].add('tabular')
        
        structure['sections_content'] = dict(sections)
        return structure
    
    def _multi_strategy_extraction(self, text: str, structure: Dict) -> List[Dict]:
        """Extract requirements using multiple strategies"""
        all_requirements = []
        
        # Strategy 1: Formal ID-based extraction
        all_requirements.extend(self._extract_formal_requirements(text))
        
        # Strategy 2: Numbered list extraction
        all_requirements.extend(self._extract_numbered_requirements(text))
        
        # Strategy 3: Section-based extraction
        all_requirements.extend(self._extract_section_requirements(structure))
        
        # Strategy 4: Pattern-based extraction
        all_requirements.extend(self._extract_pattern_based_requirements(text))
        
        # Strategy 5: Semantic extraction (fallback)
        if len(all_requirements) < 5:  # If few requirements found
            all_requirements.extend(self._extract_semantic_requirements(text))
        
        return all_requirements
    
    def _extract_formal_requirements(self, text: str) -> List[Dict]:
        """Extract requirements with formal IDs"""
        requirements = []
        
        for pattern in self.id_patterns:
            # Enhanced pattern to capture requirement blocks
            full_pattern = f'({pattern})\\s*:?\\s*(.*?)(?=(?:{"|".join(self.id_patterns)}|\\n#|\\n\\d+\\.|\\Z))'
            
            for match in re.finditer(full_pattern, text, re.DOTALL | re.IGNORECASE):
                req_id = match.group(1).strip()
                req_content = match.group(2).strip()
                
                if self._is_valid_requirement_content(req_content):
                    cleaned_content = self._clean_requirement_content(req_content)
                    requirements.append({
                        'id': req_id,
                        'text': cleaned_content,
                        'original': req_content,
                        'format': 'formal',
                        'metadata': self._extract_metadata(req_content)
                    })
        
        return requirements
    
    def _extract_numbered_requirements(self, text: str) -> List[Dict]:
        """Extract numbered requirements"""
        requirements = []
        pattern = r'^(\d+)\.\s+(.*?)(?=^\d+\.\s+|^#|\Z)'
        
        for match in re.finditer(pattern, text, re.MULTILINE | re.DOTALL):
            req_num = match.group(1)
            req_content = match.group(2).strip()
            
            if self._is_valid_requirement_content(req_content):
                cleaned_content = self._clean_requirement_content(req_content)
                requirements.append({
                    'id': f"REQ-{req_num}",
                    'text': cleaned_content,
                    'original': req_content,
                    'format': 'numbered',
                    'metadata': self._extract_metadata(req_content)
                })
        
        return requirements
    
    def _extract_section_requirements(self, structure: Dict) -> List[Dict]:
        """Extract requirements from document sections"""
        requirements = []
        requirement_sections = ['requirements', 'functional', 'non-functional', 'specifications']
        
        for section_name, section_lines in structure['sections_content'].items():
            section_lower = section_name.lower()
            
            if any(req_section in section_lower for req_section in requirement_sections):
                section_text = '\n'.join(section_lines)
                # Extract requirement-like sentences from this section
                section_reqs = self._extract_requirement_sentences(section_text, section_name)
                requirements.extend(section_reqs)
        
        return requirements
    
    def _extract_pattern_based_requirements(self, text: str) -> List[Dict]:
        """Extract requirements based on linguistic patterns"""
        requirements = []
        
        # Pattern 1: Shall/must/should patterns
        patterns = [
            r'([^.!?]*(?:shall|must|should|will|required to|needs to|has to)[^.!?]*[.!?])',
            r'([^.!?]*the system shall[^.!?]*[.!?])',
            r'([^.!?]*the application must[^.!?]*[.!?])',
            r'([^.!?]*user should be able to[^.!?]*[.!?])',
        ]
        
        for pattern in patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                req_text = match.group(1).strip()
                if self._is_valid_requirement_content(req_text):
                    requirements.append({
                        'id': f"PAT-{len(requirements) + 1:03d}",
                        'text': req_text,
                        'original': req_text,
                        'format': 'pattern',
                        'metadata': {}
                    })
        
        return requirements
    
    def _extract_semantic_requirements(self, text: str) -> List[Dict]:
        """Extract requirements using semantic analysis"""
        requirements = []
        
        # Split into sentences and analyze each
        sentences = re.split(r'[.!?]+', text)
        requirement_keywords = ['shall', 'must', 'should', 'will', 'required', 'system', 'application', 'user']
        
        for i, sentence in enumerate(sentences):
            sentence = sentence.strip()
            if len(sentence) < 25 or len(sentence) > 500:
                continue
                
            # Check if sentence contains requirement-like content
            sentence_lower = sentence.lower()
            has_keywords = any(keyword in sentence_lower for keyword in requirement_keywords)
            has_action = any(verb in sentence_lower for verb in ['create', 'update', 'delete', 'view', 'manage', 'process'])
            
            if has_keywords and has_action:
                requirements.append({
                    'id': f"SEM-{i:03d}",
                    'text': sentence,
                    'original': sentence,
                    'format': 'semantic',
                    'metadata': {}
                })
        
        return requirements
    
    def _extract_requirement_sentences(self, text: str, section: str) -> List[Dict]:
        """Extract requirement sentences from text"""
        requirements = []
        sentences = re.split(r'[.!?]+', text)
        
        for i, sentence in enumerate(sentences):
            sentence = sentence.strip()
            if self._is_valid_requirement_content(sentence):
                requirements.append({
                    'id': f"SEC-{section[:3].upper()}-{i:03d}",
                    'text': sentence,
                    'original': sentence,
                    'format': 'section',
                    'metadata': {'section': section}
                })
        
        return requirements
    
    def _is_valid_requirement_content(self, text: str) -> bool:
        """Validate if text contains a valid requirement"""
        if not text or len(text.strip()) < 20:
            return False
        
        # Exclude common non-requirement patterns
        exclude_patterns = [
            r'^Priority:\s*\w+$',
            r'^Type:\s*\w+$',
            r'^Description:\s*$',
            r'^Table of Contents',
            r'^Approved by',
            r'^Version:',
            r'^Date:',
            r'^#+',
            r'^\d+\.\d+\s+[A-Z]',
            r'^\|.*\|$',  # Table rows
        ]
        
        text_clean = text.strip()
        if any(re.match(pattern, text_clean, re.IGNORECASE) for pattern in exclude_patterns):
            return False
        
        # Should contain meaningful content
        words = text_clean.split()
        if len(words) < 4:
            return False
        
        # Check for requirement indicators
        requirement_indicators = [
            'shall', 'must', 'should', 'will', 'required', 'needs to', 'has to',
            'the system', 'the application', 'user can', 'admin can', 'shall be able to'
        ]
        
        text_lower = text_clean.lower()
        has_indicators = any(indicator in text_lower for indicator in requirement_indicators)
        
        return has_indicators
    
    def _clean_requirement_content(self, text: str) -> str:
        """Clean requirement content"""
        # Remove metadata lines but keep content
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            # Skip pure metadata lines but keep lines with content
            if not re.match(r'^(Priority|Type|Description|Source|Status|Owner):\s*\w*$', line, re.IGNORECASE):
                if ':' in line:
                    # Might be a line with both metadata and content
                    parts = line.split(':', 1)
                    if len(parts) > 1 and len(parts[1].strip()) > 10:
                        cleaned_lines.append(parts[1].strip())
                else:
                    cleaned_lines.append(line)
        
        cleaned_text = ' '.join(cleaned_lines)
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
        
        # Ensure proper sentence ending
        if cleaned_text and not cleaned_text.endswith(('.', '!', '?')):
            cleaned_text += '.'
            
        return cleaned_text
    
    def _extract_metadata(self, text: str) -> Dict[str, str]:
        """Extract metadata from requirement text"""
        metadata = {}
        
        for field, pattern in self.metadata_patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                metadata[field] = match.group(1).strip()
        
        return metadata
    
    def _deduplicate_requirements(self, requirements: List[Dict]) -> List[Dict]:
        """Remove duplicate requirements using semantic similarity"""
        if not requirements:
            return []
        
        # Use text embeddings for similarity detection
        texts = [req['text'] for req in requirements]
        embeddings = self.sentence_model.encode(texts)
        
        # Calculate similarity matrix
        similarity_matrix = cosine_similarity(embeddings)
        
        # Group similar requirements
        unique_indices = []
        visited = set()
        
        for i in range(len(requirements)):
            if i in visited:
                continue
                
            unique_indices.append(i)
            visited.add(i)
            
            # Find similar requirements to this one
            for j in range(i + 1, len(requirements)):
                if j not in visited and similarity_matrix[i][j] > 0.85:  # 85% similarity threshold
                    visited.add(j)
        
        return [requirements[i] for i in unique_indices]
    
    def _deep_analyze_requirement(self, req_data: Dict, sequence_id: int) -> Dict :
        """Perform deep analysis on a single requirement"""
        text = req_data['text']
        doc = self.nlp(text)
        
        # Comprehensive analysis
        requirement_type = self._classify_requirement_type(text)
        priority = self._assess_priority(text, req_data['metadata'])
        complexity = self._calculate_complexity(doc)
        testability = self._assess_testability(text)
        ambiguity = self._calculate_ambiguity(text)
        specificity = self._calculate_specificity(text)
        entities = [(ent.text, ent.label_) for ent in doc.ents]
        key_phrases = [chunk.text for chunk in doc.noun_chunks][:5]
        dependencies = self._identify_dependencies(text, entities)
        risks = self._identify_risks(text, complexity, ambiguity, testability)
        quality_score = self._calculate_quality_score(complexity, ambiguity, testability, specificity)
        
        return {
            "id":req_data.get('id', f"REQ-{sequence_id:03d}"),
            "original_text":req_data.get('original', text),
            "cleaned_text":text,
            "type":requirement_type,
            "priority":priority,
            "complexity":complexity,
            "testability":testability,
            "ambiguity":ambiguity,
            "specificity":specificity,
            "entities":entities,
            "key_phrases":key_phrases,
            "dependencies":dependencies,
            "risks":risks,
            "quality_score":quality_score,
            "format_detected":req_data.get('format', 'unknown'),
            "section":req_data.get('metadata', {}).get('section', 'main'),
            "metadata":req_data.get('metadata', {})
        }
    
    def _classify_requirement_type(self, text: str) -> str:
        """Classify requirement type with confidence scoring"""
        text_lower = text.lower()
        scores = {}
        
        for req_type, keywords in self.type_classifiers.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            scores[req_type] = score
        
        # Return type with highest score, default to functional
        if scores:
            best_type = max(scores.items(), key=lambda x: x[1])
            return best_type[0] if best_type[1] > 0 else 'functional'
        
        return 'functional'
    
    def _assess_priority(self, text: str, metadata: Dict) -> str:
        """Assess requirement priority"""
        # Check metadata first
        if 'priority' in metadata:
            return metadata['priority'].lower()
        
        # Infer from content
        text_lower = text.lower()
        for priority_level, indicators in self.priority_indicators.items():
            if any(indicator in text_lower for indicator in indicators):
                return priority_level
        
        return 'medium'
    
    def _calculate_complexity(self, doc) -> float:
        """Calculate requirement complexity using multiple factors"""
        factors = []
        
        # Sentence length factor
        factors.append(min(len(doc) / 50, 1.0))
        
        # Structural complexity
        clauses = len([token for token in doc if token.dep_ in ['advcl', 'relcl', 'ccomp', 'conj']])
        factors.append(min(clauses / 3, 1.0))
        
        # Conditional complexity
        conditions = len([token for token in doc if token.lemma_.lower() in ['if', 'when', 'unless', 'provided']])
        factors.append(min(conditions / 2, 1.0))
        
        # Average of factors
        return sum(factors) / len(factors)
    
    def _calculate_ambiguity(self, text: str) -> float:
        """Calculate ambiguity score"""
        ambiguous_terms = [
            'appropriate', 'as needed', 'as required', 'etc', 'and so on',
            'flexible', 'user-friendly', 'robust', 'efficient', 'fast',
            'easy to use', 'intuitive', 'when necessary', 'if applicable'
        ]
        
        vague_quantifiers = ['some', 'several', 'many', 'few', 'multiple', 'various']
        
        text_lower = text.lower()
        ambiguous_count = sum(1 for term in ambiguous_terms if term in text_lower)
        vague_count = sum(1 for quantifier in vague_quantifiers if quantifier in text_lower)
        
        total_ambiguity = ambiguous_count + vague_count
        return min(total_ambiguity / 5, 1.0)
    
    def _calculate_specificity(self, text: str) -> float:
        """Calculate how specific the requirement is"""
        specific_indicators = [
            'when', 'if', 'within', 'less than', 'greater than', 'equal to',
            'exactly', 'precisely', 'specific', 'must', 'shall'
        ]
        
        measurable_terms = [
            'seconds', 'minutes', 'hours', 'percentage', 'limit', 'size',
            'count', 'number', 'amount', 'quantity', 'frequency'
        ]
        
        text_lower = text.lower()
        specific_count = sum(1 for term in specific_indicators if term in text_lower)
        measurable_count = sum(1 for term in measurable_terms if term in text_lower)
        
        specificity = (specific_count * 0.6) + (measurable_count * 0.4)
        return min(specificity / 8, 1.0)
    
    def _assess_testability(self, text: str) -> float:
        """Assess how testable the requirement is"""
        testability_factors = []
        
        # Specificity contributes to testability
        testability_factors.append(self._calculate_specificity(text))
        
        # Presence of clear success criteria
        success_indicators = ['shall', 'must', 'will', 'should']
        text_lower = text.lower()
        clarity_score = sum(1 for indicator in success_indicators if indicator in text_lower)
        testability_factors.append(min(clarity_score / 3, 1.0))
        
        # Absence of ambiguity
        testability_factors.append(1.0 - self._calculate_ambiguity(text))
        
        return sum(testability_factors) / len(testability_factors)
    
    def _identify_dependencies(self, text: str, entities: List[Tuple[str, str]]) -> List[str]:
        """Identify potential dependencies"""
        dependencies = []
        text_lower = text.lower()
        
        # System component dependencies
        components = ['system', 'database', 'api', 'service', 'module', 'component']
        for component in components:
            if component in text_lower:
                dependencies.append(f"depends_on_{component}")
        
        # Entity-based dependencies
        for entity, label in entities:
            if label in ['ORG', 'PRODUCT', 'PERSON']:
                dependencies.append(f"depends_on_{entity.lower()}")
        
        return dependencies
    
    def _identify_risks(self, text: str, complexity: float, ambiguity: float, testability: float) -> List[str]:
        """Identify potential risks in requirement"""
        risks = []
        
        if ambiguity > 0.7:
            risks.append("high_ambiguity")
        if complexity > 0.8:
            risks.append("high_complexity")
        if testability < 0.3:
            risks.append("low_testability")
        if ambiguity > 0.5 and complexity > 0.6:
            risks.append("high_interpretation_risk")
            
        return risks
    
    def _calculate_quality_score(self, complexity: float, ambiguity: float, testability: float, specificity: float) -> float:
        """Calculate overall requirement quality score"""
        # Weight the factors
        weights = {
            'complexity': 0.2,      # Lower is better
            'ambiguity': 0.3,       # Lower is better  
            'testability': 0.3,     # Higher is better
            'specificity': 0.2      # Higher is better
        }
        
        score = (
            (1 - complexity) * weights['complexity'] +
            (1 - ambiguity) * weights['ambiguity'] +
            testability * weights['testability'] +
            specificity * weights['specificity']
        )
        
        return round(score, 2)
    
    def generate_analysis_report(self, requirements: List[Requirement]) -> Dict:
        """Generate comprehensive analysis report"""
        if not requirements:
            return {}
        
        # Basic statistics
        total_requirements = len(requirements)
        type_distribution = Counter([req.requirement_type for req in requirements])
        priority_distribution = Counter([req.priority for req in requirements])
        
        # Quality metrics
        avg_quality = np.mean([req.quality_score for req in requirements])
        avg_complexity = np.mean([req.complexity for req in requirements])
        avg_testability = np.mean([req.testability for req in requirements])
        
        # Risk analysis
        total_risks = sum(len(req.risks) for req in requirements)
        high_risk_reqs = [req for req in requirements if req.quality_score < 0.5]
        
        return {
            'summary': {
                'total_requirements': total_requirements,
                'average_quality_score': round(avg_quality, 2),
                'average_complexity': round(avg_complexity, 2),
                'average_testability': round(avg_testability, 2),
                'total_risks_identified': total_risks,
                'high_risk_requirements': len(high_risk_reqs)
            },
            'distribution': {
                'by_type': dict(type_distribution),
                'by_priority': dict(priority_distribution)
            },
            'quality_analysis': {
                'excellent_quality': len([r for r in requirements if r.quality_score >= 0.8]),
                'good_quality': len([r for r in requirements if 0.6 <= r.quality_score < 0.8]),
                'fair_quality': len([r for r in requirements if 0.4 <= r.quality_score < 0.6]),
                'poor_quality': len([r for r in requirements if r.quality_score < 0.4])
            },
            'recommendations': self._generate_recommendations(requirements)
        }
    
    def _generate_recommendations(self, requirements: List[Requirement]) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        # Check for common issues
        ambiguous_reqs = [r for r in requirements if r.ambiguity > 0.7]
        complex_reqs = [r for r in requirements if r.complexity > 0.8]
        low_testability_reqs = [r for r in requirements if r.testability < 0.3]
        
        if ambiguous_reqs:
            recommendations.append(f"Clarify {len(ambiguous_reqs)} ambiguous requirements")
        
        if complex_reqs:
            recommendations.append(f"Simplify {len(complex_reqs)} highly complex requirements")
        
        if low_testability_reqs:
            recommendations.append(f"Make {len(low_testability_reqs)} requirements more testable")
        
        if not recommendations:
            recommendations.append("Requirements quality is generally good")
        
        return recommendations
