# remedies/serializers.py
from rest_framework import serializers
from .models import Remedy, Category ,Review

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



class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'comment', 'rating', 'created_at']


class RemedyDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    reviews = ReviewSerializer(many=True, read_only=True)

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
            'reviews',
            'created_at',
        ]
        read_only_fields = ['created_at']



