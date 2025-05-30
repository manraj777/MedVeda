from django.db import models
from users.models import User
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True,max_length=120)

    def __str__(self):
        return self.name

class Remedy(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, max_length=200)
    description = models.TextField()
    ingredients = models.TextField()
    preparation = models.TextField()
    health_benefits = models.TextField()
    image = models.URLField(blank=True, null=True)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='submitted_remedies')
    rating = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=True)  # default=True for now
    approved_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_remedies')
    approved_at = models.DateTimeField(null=True, blank=True)
    


    # AI-enhanced suggestion fields
    ai_title = models.CharField(max_length=200, blank=True, null=True)
    ai_description = models.TextField(blank=True, null=True)
    ai_ingredients = models.TextField(blank=True, null=True)
    ai_preparation = models.TextField(blank=True, null=True)
    ai_health_benefits = models.TextField(blank=True, null=True)

    ai_accepted = models.BooleanField(default=False)

    original_input = models.TextField(blank=True, null=True)
    ai_cleaned=models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    

class Review(models.Model):
    remedy = models.ForeignKey(Remedy, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    comment = models.TextField()
    rating = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.remedy.title} by {self.user or 'Anonymous'}"


class SavedRemedy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    remedy = models.ForeignKey(Remedy, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'remedy')
