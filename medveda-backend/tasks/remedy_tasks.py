
from celery import shared_task
from services.ai_remedy_cleaner import clean_remedy_ai
from remedies.models import Remedy

@shared_task
def clean_remedy_with_ai(remedy_id):
    remedy = Remedy.objects.get(id=remedy_id)
    raw_text = f"Title: {remedy.title}\nDescription: {remedy.description}\nIngredients: {remedy.ingredients}\nPreparation: {remedy.preparation}\nBenefits: {remedy.health_benefits}"

    cleaned = clean_remedy_ai(raw_text)
    if cleaned:
        remedy.ai_title = cleaned.get("title")
        remedy.ai_description = cleaned.get("description")
        remedy.ai_ingredients = cleaned.get("ingredients")
        remedy.ai_preparation = cleaned.get("preparation")
        remedy.ai_health_benefits = cleaned.get("benefits")
        remedy.save()
