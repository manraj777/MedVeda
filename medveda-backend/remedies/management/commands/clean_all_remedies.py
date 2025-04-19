# backend/management/commands/clean_all_remedies.py
from django.core.management.base import BaseCommand
from remedies.models import Remedy
from services.ai_remedy_cleaner import clean_remedy_ai

class Command(BaseCommand):
    help = "Cleans all remedy entries with Gemini AI"

    def handle(self, *args, **kwargs):
        remedies = Remedy.objects.all()
        for remedy in remedies:
            raw_text = f"Title: {remedy.title}\nDescription: {remedy.description}\nIngredients: {remedy.ingredients}\nPreparation: {remedy.preparation}\nBenefits: {remedy.health_benefits}"
            cleaned = clean_remedy_ai(raw_text)
            if cleaned:
                remedy.ai_title = cleaned.get("title")
                remedy.ai_description = cleaned.get("description")
                remedy.ai_ingredients = cleaned.get("ingredients")
                remedy.ai_preparation = cleaned.get("preparation")
                remedy.ai_health_benefits = cleaned.get("benefits")
                remedy.save()
                self.stdout.write(f"✔ Cleaned: {remedy.title}")
            if not cleaned:
                self.stdout.write(f"⚠️ Skipped (invalid JSON): {remedy.title}")