from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.database import Template, TemplateApplication
from app.schemas.template import TemplateCreate, TemplateUpdate
from app.services.test_service import TestService
from fastapi import HTTPException, status
import json

class TemplateService:
    def __init__(self, db: Session):
        self.db = db

    async def get_templates(self, skip: int = 0, limit: int = 100, user_id: int = None) -> List[Template]:
        query = self.db.query(Template)
        if user_id:
            query = query.filter(Template.user_id == user_id)
        return query.offset(skip).limit(limit).all()

    async def get_template(self, template_id: int) -> Template:
        template = self.db.query(Template).filter(Template.id == template_id).first()
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        return template

    async def create_template(self, template_data: TemplateCreate, user_id: int) -> Template:
        # Calculate test cases count from template content
        test_cases_count = len(template_data.content.get('test_cases', []))
        
        template = Template(
            **template_data.dict(),
            user_id=user_id,
            test_cases_count=test_cases_count
        )
        
        self.db.add(template)
        self.db.commit()
        self.db.refresh(template)
        return template

    async def update_template(self, template_id: int, template_data: TemplateUpdate, user_id: int) -> Template:
        template = await self.get_template(template_id)
        
        # Check ownership
        if template.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this template")
        
        update_data = template_data.dict(exclude_unset=True)
        
        # Update test cases count if content changed
        if 'content' in update_data:
            update_data['test_cases_count'] = len(update_data['content'].get('test_cases', []))
        
        for field, value in update_data.items():
            setattr(template, field, value)
        
        self.db.commit()
        self.db.refresh(template)
        return template

    async def delete_template(self, template_id: int, user_id: int) -> bool:
        template = await self.get_template(template_id)
        
        if template.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this template")
        
        self.db.delete(template)
        self.db.commit()
        return True

    async def apply_template(self, template_id: int, project_id: int, user_id: int) -> TemplateApplication:
        template = await self.get_template(template_id)
        
        # Check if template is public or belongs to user
        if not template.is_public and template.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to use this template")
        
        # Create test cases from template
        test_service = TestService(self.db)
        test_cases_created = 0
        
        for template_tc in template.content.get('test_cases', []):
            # Create test case in the project
            # This would integrate with your existing test case creation logic
            test_cases_created += 1
        
        # Record template application
        application = TemplateApplication(
            template_id=template_id,
            project_id=project_id,
            test_cases_created=test_cases_created
        )
        
        # Update template usage count
        template.usage_count += 1
        
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        
        return application

    async def get_categories(self) -> List[str]:
        categories = self.db.query(Template.category).distinct().all()
        return [cat[0] for cat in categories]

    async def search_templates(self, query: str, category: Optional[str] = None, user_id: int = None) -> List[Template]:
        search_query = self.db.query(Template).filter(
            Template.name.ilike(f"%{query}%") | 
            Template.description.ilike(f"%{query}%")
        )
        
        if category:
            search_query = search_query.filter(Template.category == category)
        
        if user_id:
            search_query = search_query.filter(Template.user_id == user_id)
        
        return search_query.all()