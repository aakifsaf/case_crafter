import pdfplumber
from docx import Document
import aiofiles
from typing import List, Dict
import re
import os

class AdvancedDocumentProcessor:
    def __init__(self):
        self.supported_formats = ['.pdf', '.docx', '.txt']
    
    async def process_document(self, file_path: str) -> Dict:
        """Extract and structure document content with metadata"""
        text = await self._extract_text(file_path)
        structured_data = self._structure_content(text)
        requirements = self._extract_requirements(structured_data)
        
        return {
            'raw_text': text,
            'structured_data': structured_data,
            'requirements': requirements,
            'metadata': self._extract_metadata(text, file_path)
        }
    
    async def _extract_text(self, file_path: str) -> str:
        """Extract text from different file formats"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.pdf':
            return self._extract_from_pdf(file_path)
        elif file_extension == '.docx':
            return self._extract_from_docx(file_path)
        elif file_extension == '.txt':
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
                return await file.read()
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    
    def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    
    def _extract_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        doc = Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    
    def _structure_content(self, text: str) -> List[Dict]:
        """Convert raw text to structured sections"""
        sections = []
        lines = text.split('\n')
        
        current_section = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if self._is_section_header(line):
                if current_section:
                    sections.append(current_section)
                current_section = {
                    'title': line,
                    'content': [],
                    'level': self._get_header_level(line)
                }
            elif current_section:
                current_section['content'].append(line)
        
        if current_section:
            sections.append(current_section)
        
        return sections
    
    def _is_section_header(self, line: str) -> bool:
        """Check if a line is a section header"""
        # Simple heuristic for section headers
        header_indicators = [
            r'^\d+\.',  # Numbered sections: "1. Introduction"
            r'^[A-Z][A-Z\s]{5,}',  # All caps lines
            r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:$',  # Title with colon
        ]
        
        for pattern in header_indicators:
            if re.match(pattern, line):
                return True
        return False
    
    def _get_header_level(self, line: str) -> int:
        """Determine header level (1 for main, 2 for sub, etc.)"""
        if re.match(r'^\d+\.\d+', line):  # "1.1 Section"
            return 2
        elif re.match(r'^\d+\.', line):  # "1. Section"
            return 1
        else:
            return 1
    
    def _extract_requirements(self, structured_data: List[Dict]) -> List[str]:
        """Extract requirements from structured content"""
        requirements = []
        requirement_keywords = ['shall', 'must', 'will', 'should', 'required to', 'needs to']
        
        for section in structured_data:
            # Check section title for requirements
            if any(keyword in section['title'].lower() for keyword in ['requirement', 'functional', 'specification']):
                for line in section['content']:
                    if any(keyword in line.lower() for keyword in requirement_keywords):
                        requirements.append(line)
            
            # Check content for requirement-like sentences
            for line in section['content']:
                if any(keyword in line.lower() for keyword in requirement_keywords) and len(line.split()) > 3:
                    requirements.append(line)
        
        return list(set(requirements))  # Remove duplicates
    
    def _extract_metadata(self, text: str, file_path: str) -> Dict:
        """Extract metadata from document"""
        words = text.split()
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        
        return {
            'file_path': file_path,
            'word_count': len(words),
            'sentence_count': len(sentences),
            'avg_sentence_length': sum(len(s.split()) for s in sentences) / len(sentences) if sentences else 0,
            'requirement_keywords_found': self._count_requirement_keywords(text)
        }
    
    def _count_requirement_keywords(self, text: str) -> Dict[str, int]:
        """Count occurrence of requirement-related keywords"""
        keywords = {
            'shall': 0, 'must': 0, 'will': 0, 'should': 0,
            'required': 0, 'need': 0, 'requirement': 0
        }
        
        text_lower = text.lower()
        for keyword in keywords:
            keywords[keyword] = text_lower.count(keyword)
        
        return keywords