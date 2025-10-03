from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from app.core.config import settings

# Database setup
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)  # FIX: Never null
    
    # Relationships
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    test_suites = relationship("TestSuite", back_populates="project")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500))
    file_size = Column(Integer)
    file_type = Column(String(50))
    status = Column(String(50), default="uploaded")
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processed_text = Column(Text)
    meta_data = Column(JSON)
    
    # Relationships
    project = relationship("Project", back_populates="documents")
    requirements = relationship("Requirement", back_populates="document", cascade="all, delete-orphan")
    test_suites = relationship("TestSuite", back_populates="document")

class Requirement(Base):
    __tablename__ = "requirements"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    original_text = Column(Text, nullable=False)
    requirement_type = Column(String(50))
    complexity_score = Column(Integer)
    analysis_result = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    document = relationship("Document", back_populates="requirements")
    test_cases = relationship("TestCase", back_populates="requirement", cascade="all, delete-orphan")

class TestCase(Base):
    __tablename__ = "test_cases"
    
    id = Column(Integer, primary_key=True, index=True)
    requirement_id = Column(Integer, ForeignKey("requirements.id"))
    test_suite_id = Column(Integer, ForeignKey("test_suites.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    test_steps = Column(JSON)
    expected_results = Column(Text)
    test_data = Column(JSON)
    test_type = Column(String(50))
    priority = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    requirement = relationship("Requirement", back_populates="test_cases")
    test_suite = relationship("TestSuite", back_populates="test_cases")

class TestSuite(Base):
    __tablename__ = "test_suites"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    document_id = Column(Integer, ForeignKey("documents.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    project = relationship("Project", back_populates="test_suites")
    document = relationship("Document", back_populates="test_suites")
    test_cases = relationship("TestCase", back_populates="test_suite", cascade="all, delete-orphan")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables function
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    
    # Create uploads directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    print(f"✅ Upload directory created: {settings.UPLOAD_DIR}")