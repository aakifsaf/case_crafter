import pdfplumber
from docx import Document
import aiofiles
from typing import List, Dict
import re
import os
from pathlib import Path
import asyncio
import openai
import json

class AdvancedDocumentProcessor:
    def __init__(self, openrouter_api_key: str = None):
        self.supported_formats = ['.pdf', '.docx', '.txt']
    
    async def process_document(self, file_path: str) -> Dict:
        """Extract text from document and then extract requirements using AI"""
        try:
            # Step 1: Extract raw text from document
            text = await self._extract_text(file_path)
            print(f"Extracted text: {text}")
            if not text.strip():
                return {
                    'success': False,
                    'error': 'Document is empty or no text could be extracted',
                    'raw_text': '',
                    'metadata': {}
                }
            metadata = self._extract_metadata(text, file_path)
            
            return {
                'success': True,
                'raw_text': text,
                'metadata': metadata
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'raw_text': '',
                'metadata': {}
            }
    
    async def _extract_text(self, file_path: str) -> str:
        """Extract raw text from document"""
        file_path = await self._validate_file_path(file_path)
        file_extension = Path(file_path).suffix.lower()
        
        if file_extension == '.pdf':
            return await self._extract_from_pdf(file_path)
        elif file_extension == '.docx':
            return await self._extract_from_docx(file_path)
        elif file_extension == '.txt':
            return await self._extract_from_text(file_path)
        else:
            raise ValueError(f"Unsupported format: {file_extension}")
    
    async def _validate_file_path(self, file_path: str) -> str:
        """Validate file path"""
        if not os.path.isabs(file_path):
            file_path = os.path.abspath(file_path)
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if not os.path.isfile(file_path):
            raise ValueError(f"Path is not a file: {file_path}")
        
        file_extension = Path(file_path).suffix.lower()
        if file_extension not in self.supported_formats:
            raise ValueError(f"Unsupported format: {file_extension}")
        
        return file_path
    
    async def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF"""
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text.strip()
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")
    
    async def _extract_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX"""
        try:
            # ✅ First verify file exists and is accessible
            if not os.path.exists(file_path):
                raise Exception(f"File not found: {file_path}")
            
            # ✅ Check file size to ensure it's not empty/corrupt
            file_size = os.path.getsize(file_path)
            if file_size == 0:
                raise Exception("File is empty or corrupted")
            
            # ✅ Verify it's actually a DOCX file
            if not file_path.lower().endswith('.docx'):
                raise Exception("File is not a DOCX document")
            
            # ✅ Use absolute path and ensure proper file permissions
            absolute_path = os.path.abspath(file_path)
            
            doc = Document(absolute_path)
            text = ""
            for paragraph in doc.paragraphs:
                if paragraph.text and paragraph.text.strip():
                    text += paragraph.text + "\n"
            
            if not text.strip():
                raise Exception("No extractable text found in DOCX document")
                
            return text.strip()
            
        except Exception as e:
            raise Exception(f"DOCX extraction failed: {str(e)}")
    
    async def _extract_from_text(self, file_path: str) -> str:
        """Extract text from TXT"""
        encodings = ['utf-8', 'latin-1', 'windows-1252']
        for encoding in encodings:
            try:
                async with aiofiles.open(file_path, 'r', encoding=encoding) as file:
                    content = await file.read()
                    if content.strip():
                        return content
            except UnicodeDecodeError:
                continue
        raise ValueError("Could not decode text file")
    
    def _extract_metadata(self, text: str, file_path: str) -> Dict:
        """Extract comprehensive metadata from document"""
        words = text.split()
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        
        return {
            'file_path': file_path,
            'file_size': os.path.getsize(file_path) if os.path.exists(file_path) else 0,
            'word_count': len(words),
            'sentence_count': len(sentences),
            'avg_sentence_length': sum(len(s.split()) for s in sentences) / len(sentences) if sentences else 0,
        }