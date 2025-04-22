# remedies/serializers.py
from rest_framework import serializers
from .models import Remedy, Category ,Review, SavedRemedy

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
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all(), write_only=True
    )
    reviews = ReviewSerializer(many=True, read_only=True)
    image = serializers.URLField(required=False, allow_blank=True)
    is_saved = serializers.SerializerMethodField()

    def get_is_saved(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.savedremedy_set.filter(user=user).exists()
        return False

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
            'category_id',
            'rating',
            'reviews',
            'created_at',
            'is_saved'
        ]
        read_only_fields = ['created_at']



class SavedRemedySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    remedy = RemedyListSerializer(read_only=True)

    class Meta:
        model = SavedRemedy
        fields = ['id', 'user', 'remedy', 'created_at']



class RemedyAdminSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()
    category = CategorySerializer()

    class Meta:
        model = Remedy
        fields = [
            'id', 'title', 'slug', 'category', 'is_approved',
            'created_by', 'created_at',
            
        ]
    def create(self, validated_data):
        return Remedy.objects.create(**validated_data)


# remedies/serializers.py
class RemedySubmissionSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all()
    )

    class Meta:
        model = Remedy
        fields = [
            'title', 'slug', 'description', 'ingredients',
            'preparation', 'health_benefits', 'image',
            'category_id'
        ]
