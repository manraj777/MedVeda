from rest_framework import serializers
from .models import Remedy, Category

class RemedySerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()

    class Meta:
        model = Remedy
        fields = ['id', 'title', 'description', 'image_url', 'rating', 'category']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'slug']