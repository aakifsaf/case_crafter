from openai import AsyncOpenAI
from typing import List, Dict, Any
import json
import logging
from datetime import datetime
import re

logger = logging.getLogger(__name__)

client = AsyncOpenAI(
    api_key="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",
    base_url="https://openrouter.ai/api/v1"
)


def extract_json(text: str) -> str:
    # Remove markdown code block if present
    text = text.strip()
    if text.startswith("```json"):
        text = re.sub(r"^```json", "", text)
        text = re.sub(r"```$", "", text)
    return text.strip()

class AIRequirementEnhancer:
    def __init__(self, api_key: str = None):
        if api_key:
            client.api_key = api_key  
    
    async def enhance_requirements(self, requirements: List[Dict]) -> List[Dict]:
        """Enhance all requirements in a single API call"""
        try:
            # Prepare batch prompt with all requirements
            batch_prompt = self._create_batch_prompt(requirements)
            
            # Single API call for all requirements
            enhanced_requirements = await self._get_structured_requirements_batch(batch_prompt)
            
            logger.info(f"Successfully enhanced {len(enhanced_requirements)} requirements in single API call")
            return enhanced_requirements
            
        except Exception as e:
            logger.error(f"Batch enhancement failed: {e}, falling back to individual processing")
    
    def _create_batch_prompt(self, requirements: List[Dict]) -> str:
        """Create a single prompt for batch processing"""
        
        prompt = f"""
        Convert the following software requirements into structured format. Process ALL requirements in this single request.

        REQUIREMENTS TO PROCESS:
        {requirements}

        For EACH requirement, extract and structure with the following fields:
        - id: Same as input requirement id
        - description: Detailed, clear description
        - requirement_type: Functional, Non-Functional, Security, Performance, UI, Data, Business, Technical
        - priority: Critical, High, Medium, Low
        - complexity_score: Estimate complexity 0.1-1.0
        - risk_level: High, Medium, Low

        Return a JSON array where each object corresponds to the requirements in order.
        Example format:
        [
          {{
            "id": "1",
            "description": "The system shall allow new users to register...",
            "requirement_type": "Functional",
            "priority": "High",
            "complexity_score": 0.7,
            "risk_level": "Medium"
          }},
          ... // more requirements in same order
        ]

        Return ONLY valid JSON array, no other text.
        """
        
        return prompt
    
    async def _get_structured_requirements_batch(self, prompt: str) -> List[Dict[str, Any]]:
        """Single API call to structure all requirements"""
        
        try:
            response = await client.chat.completions.create(
                model="deepseek/deepseek-chat-v3.1:free",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a business analyst expert at structuring software requirements. Process all requirements in the order provided and return a JSON array."
                    },
                    {
                        "role": "user", 
                        "content": prompt,
                    }
                ],
                temperature=0.1
            )
            
            result_text = response.choices[0].message.content
            cleaned_text = extract_json(result_text)
            print(f"Cleaned JSON text: {cleaned_text}")
            structured_data = json.loads(cleaned_text)
            
            # Validate response structure
            if not isinstance(structured_data, list):
                raise ValueError("Expected JSON array response")
                
            logger.info(f"Batch API call successful, processed {len(structured_data)} requirements")
            return structured_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            raise
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            raise
    