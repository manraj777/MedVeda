# backend/services/ai_remedy_cleaner.py
import os
import google.generativeai as genai
from google.generativeai.types import generation_types
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
MODEL_NAME = "gemini-2.0-pro-exp-02-05"

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

Respond ONLY with a clean JSON object — no markdown, no explanation, no backticks, no surrounding text. Your response must be valid JSON.


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
    model = genai.GenerativeModel(MODEL_NAME)
    prompt = prompt_template.format(raw_text=raw_remedy_text)
    try:
        response: generation_types.GenerateContentResponse = model.generate_content(prompt)
        raw_output = response.text or response.parts[0].text  # fallback
        
        # Debug: print raw to check
        print("Raw Output:\n", raw_output)

        # Attempt to strip any markdown formatting
        if raw_output.strip().startswith("```json"):
            raw_output = raw_output.strip().removeprefix("```json").removesuffix("```").strip()
        
        if not raw_output.strip().startswith('{'):
            raise ValueError("LLM did not return JSON. Got: " + raw_output[:100])

        return json.loads(raw_output)
    except Exception as e:
        print(f"Error using Gemini: {e}")
        return {}