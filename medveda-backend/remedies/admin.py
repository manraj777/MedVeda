
from django.contrib import admin
from .models import Remedy

@admin.register(Remedy)
class RemedyAdmin(admin.ModelAdmin):
    list_display = ("title", "ai_accepted", "final_title")

    readonly_fields = ("ai_title", "ai_description", "ai_ingredients", "ai_preparation", "ai_health_benefits")

    actions = ["accept_ai_suggestion", "reject_ai_suggestion"]

    def accept_ai_suggestion(self, request, queryset):
        for remedy in queryset:
            if not remedy.ai_title or not remedy.ai_ingredients or not remedy.ai_preparation:
                self.message_user(request, f"Skipped {remedy.title} — AI data incomplete.", level="warning")
                continue
            if remedy.ai_title:
                remedy.title = remedy.ai_title
            remedy.description = remedy.ai_description or remedy.description
            remedy.ingredients = remedy.ai_ingredients or remedy.ingredients
            remedy.preparation = remedy.ai_preparation or remedy.preparation
            remedy.health_benefits = remedy.ai_health_benefits or remedy.health_benefits
            remedy.ai_accepted = True
            remedy.save()
        self.message_user(request, "AI suggestions accepted.")
    
    def reject_ai_suggestion(self, request, queryset):
        queryset.update(ai_accepted=False)
        self.message_user(request, "AI suggestions rejected.")
    
    def final_title(self, obj):
        return obj.ai_title if obj.ai_accepted and obj.ai_title else obj.title
    final_title.short_description = "Final Title"

    accept_ai_suggestion.short_description = "✅ Accept AI-suggested version"
    reject_ai_suggestion.short_description = "❌ Reject AI-suggested version"