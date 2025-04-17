# remedies/serializers.py
from rest_framework import serializers
from .models import Remedy, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['name', 'slug']


class RemedyListSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()

    class Meta:
        model  = Remedy
        fields = [
            'id',
            'title',
            'slug',
            'image',
            'rating',
            'category',
        ]


class RemedyDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model  = Remedy
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'ingredients',
            'preparation',
            'health_benefits',
            'image',
            'category',
            'rating',
            'created_at',
        ]
        read_only_fields = ['created_at']
