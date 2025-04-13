from django.db import models

# future update
class Testimonial(models.Model):
    name = models.CharField(max_length=50)
    avatar = models.URLField(blank=True)
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)


