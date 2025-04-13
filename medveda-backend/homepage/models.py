from django.db import models

class Testimonial(models.Model):
    name = models.CharField(max_length=50)
    avatar = models.URLField(blank=True)
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.rating} stars"

# class NewsletterSubscription(models.Model):
#     email = models.EmailField(unique=True)
#     subscribed_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.email

# class HowItWorksStep(models.Model):
#     title = models.CharField(max_length=100)
#     description = models.TextField()
#     icon = models.CharField(max_length=50)  # Optional for frontend display
#     order = models.PositiveSmallIntegerField()

#     def __str__(self):
#         return f"{self.order}. {self.title}"

# class StaticSection(models.Model):
#     key = models.CharField(max_length=50, unique=True)  # e.g., 'hero', 'footer'
#     heading = models.CharField(max_length=200)
#     subheading = models.TextField()
#     cta_text = models.CharField(max_length=100, blank=True)
#     cta_url = models.URLField(blank=True)

#     def __str__(self):
#         return self.key
