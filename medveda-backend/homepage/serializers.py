from rest_framework import serializers
from .models import Testimonial, NewsletterSubscription, HowItWorksStep, StaticSection

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['name', 'avatar', 'comment', 'rating', 'created_at']

# class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = NewsletterSubscription
#         fields = ['email']

# class HowItWorksSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = HowItWorksStep
#         fields = ['title', 'description', 'icon', 'order']

# class StaticSectionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = StaticSection
#         fields = ['key', 'heading', 'subheading', 'cta_text', 'cta_url']
