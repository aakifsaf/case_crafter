import pdfplumber
from docx import Document
import aiofiles
from typing import List, Dict
import re

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
            'metadata': self._extract_metadata(text)
        }
    
    def _structure_content(self, text: str) -> List[Dict]:
        """Convert raw text to structured sections"""
        sections = []
        lines = text.split('\n')
        
        current_section = None
        for line in lines:
            if self._is_section_header(line):
                if current_section:
                    sections.append(current_section)
                current_section = {
                    'title': line.strip(),
                    'content': [],
                    'level': self._get_header_level(line)
                }
            elif current_section and line.strip():
                current_section['content'].append(line.strip())
        
        return sections