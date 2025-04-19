# backend/services/ai_remedy_cleaner.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

prompt_template ="""
Clean this remedy. Make sure the following:
- Separate the data into correct sections: ingredients, preparation steps, and health benefits.
- If any section is missing or incomplete, intelligently add it.
- Correct grammar, structure, and factual errors.
- Write each of the following sections in clear points: ingredients, preparation, benefits.
- Ingredients: Return only raw materials required (no actions or benefits).
- Preparation: Return step-by-step list of instructions.
- Benefits: Return as a list of individual health benefits.
- If title is missing or unclear, generate a suitable title.
- Return only a valid JSON object with the following keys: `title`, `description`, `ingredients`, `preparation`, `benefits`.

Example output format:
{{
  "title": "...",
  "description": "...",
  "ingredients": ["...", "..."],
  "preparation": ["Step 1...", "Step 2..."],
  "benefits": ["...", "..."]
}}

Remedy Input:
{raw_text}
"""

def clean_remedy_ai(raw_remedy_text: str) -> dict:
    model = genai.GenerativeModel('gemini-pro')
    prompt = prompt_template.format(raw_text=raw_remedy_text)
    
    try:
        response = model.generate_content(prompt)
        json_data = response.text
        import json
        return json.loads(json_data)
    except Exception as e:
        print(f"Error using Gemini: {e}")
        return {}
