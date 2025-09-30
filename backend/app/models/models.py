from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    documents = relationship("Document", back_populates="project")
    test_suites = relationship("TestSuite", back_populates="project")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    filename = Column(String)
    file_path = Column(String)
    file_size = Column(Integer)
    processed_text = Column(Text)
    metadata = Column(JSON)
    status = Column(String, default="uploaded")  # uploaded, processing, processed, error
    
    # Relationships
    project = relationship("Project", back_populates="documents")
    requirements = relationship("Requirement", back_populates="document")

class Requirement(Base):
    __tablename__ = "requirements"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    original_text = Column(Text)
    structured_data = Column(JSON)
    analysis_result = Column(JSON)
    requirement_type = Column(String)
    complexity_score = Column(Integer)
    
    # Relationships
    document = relationship("Document", back_populates="requirements")
    test_cases = relationship("TestCase", back_populates="requirement")

class TestCase(Base):
    __tablename__ = "test_cases"
    
    id = Column(Integer, primary_key=True, index=True)
    requirement_id = Column(Integer, ForeignKey("requirements.id"))
    test_suite_id = Column(Integer, ForeignKey("test_suites.id"))
    name = Column(String)
    description = Column(Text)
    test_steps = Column(JSON)  # Store as JSON array
    expected_results = Column(Text)
    test_data = Column(JSON)
    test_type = Column(String)  # positive, negative, edge, security
    priority = Column(String)   # high, medium, low
    
    # Relationships
    requirement = relationship("Requirement", back_populates="test_cases")
    test_suite = relationship("TestSuite", back_populates="test_cases")