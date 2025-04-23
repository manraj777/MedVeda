from rest_framework import generics, permissions
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.postgres.search import SearchVector, SearchQuery
from .utils import update_remedy_rating
from .models import Remedy, Category, Review,SavedRemedy
from .serializers import (
    RemedyListSerializer,
    RemedyDetailSerializer,
    CategorySerializer,
    ReviewSerializer,
    RemedyAdminSerializer,
    RemedySubmissionSerializer

)
from .permissions import IsReviewAuthorOrReadOnly, IsAdminOrReadOnly
from django.utils.timezone import now
from django.utils.text import slugify
from services import ai_remedy_cleaner


# ——— Search endpoint ————————————————————————————
@api_view(['GET'])
def search_remedies(request):
    query      = request.GET.get('q', '')
    category   = request.GET.get('category')
    min_rating = request.GET.get('min_rating')

    qs = Remedy.objects.filter().order_by('id')

    if query:
        qs = qs.annotate(search=SearchVector('title','description','ingredients')) \
               .filter(search=SearchQuery(query))

    if category:
        qs = qs.filter(category__slug=category)
    if min_rating:
        qs = qs.filter(rating__gte=float(min_rating))

    paginator = PageNumberPagination()
    paginator.page_size = 6
    page_qs   = paginator.paginate_queryset(qs, request)

    serializer = RemedyListSerializer(page_qs, many=True)
    return paginator.get_paginated_response(serializer.data)


# ——— Category list endpoint ——————————————————————
@api_view(['GET'])
def category_list(request):
    cats       = Category.objects.all()
    serializer = CategorySerializer(cats, many=True)
    return Response(serializer.data)


# ——— Detail endpoint ———————————————————————————
class RemedyDetailView(generics.RetrieveAPIView):
    """
    GET /remedies/{slug}/
    """
    queryset         = Remedy.objects.all()
    serializer_class = RemedyDetailSerializer
    lookup_field     = 'slug'


# ——— Review endpoint ———————————————————————————
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request, slug):
    try:
        remedy = Remedy.objects.get(slug=slug)
    except Remedy.DoesNotExist:
        return Response({'error': 'Remedy not found'}, status=404)

    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        
        # Save the review
        serializer.save(remedy=remedy, user=request.user if request.user.is_authenticated else None)
        
        # Update average rating
        update_remedy_rating(remedy)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class ReviewUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsReviewAuthorOrReadOnly]


    def perform_update(self, serializer):
        review = serializer.save()
        update_remedy_rating(review.remedy)

    def perform_destroy(self, instance):
        remedy = instance.remedy
        instance.delete()
        update_remedy_rating(remedy)

class RemedyReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        return Review.objects.filter(remedy__slug=slug).order_by('-created_at')



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_remedies(request):
    saved = SavedRemedy.objects.filter(user=request.user).select_related('remedy')
    remedies = [s.remedy for s in saved]
    serializer = RemedyListSerializer(remedies, many=True)
    return Response(serializer.data)

from django.utils.text import slugify

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_remedy_raw(request):
    from django.utils.text import slugify
    from .models import Category

    # ensure category exists
    category_name = request.data.get("category", "General Wellness").strip()
    category_slug = slugify(category_name) or "general-wellness"
    category, _ = Category.objects.get_or_create(
        name=category_name,
        defaults={"slug": category_slug}
    )

    # build only the fields your serializer expects
    data = {
        "title":            request.data.get("title", ""),
        "slug":             slugify(request.data.get("title", ""))[:200],
        "description":      request.data.get("description", ""),
        "ingredients":      request.data.get("ingredients", ""),
        "preparation":      request.data.get("preparation", ""),
        "health_benefits":  request.data.get("health_benefits", ""),
        "image":            request.data.get("image", ""),
        "category_id":      category.id,   # write into category via category_id
    }

    serializer = RemedySubmissionSerializer(data=data)
    if serializer.is_valid():
        serializer.save(created_by=request.user, is_approved=False, ai_cleaned=False)
        return Response({'message': '✅ Remedy submitted successfully!'}, status=201)
    return Response(serializer.errors, status=400)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_remedy(request, remedy_id):
    remedy = Remedy.objects.get(id=remedy_id)
    SavedRemedy.objects.get_or_create(user=request.user, remedy=remedy)
    return Response({'status': 'saved'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unsave_remedy(request, remedy_id):
    SavedRemedy.objects.filter(user=request.user, remedy__id=remedy_id).delete()
    return Response({'status': 'unsaved'})




@api_view(['GET'])
@permission_classes([IsAdminOrReadOnly])
def pending_remedies(request):
    remedies = Remedy.objects.filter(is_approved=False)
    serializer = RemedyAdminSerializer(remedies, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminOrReadOnly])
def approve_remedy(request, remedy_id):
    try:
        remedy = Remedy.objects.get(id=remedy_id)
        remedy.is_approved = True
        remedy.approved_by = request.user
        remedy.approved_at = now()
        remedy.save()
        return Response({'status': 'approved'})
    except Remedy.DoesNotExist:
        return Response({'error': 'Remedy not found'}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAdminOrReadOnly])
def delete_remedy(request, remedy_id):
    try:
        remedy = Remedy.objects.get(id=remedy_id)
        remedy.delete()
        return Response({"status": "deleted"})
    except Remedy.DoesNotExist:
        return Response({"error": "Remedy not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAdminOrReadOnly])
def dashboard_stats(request):
    return Response({
        "total_remedies": Remedy.objects.count(),
        "pending": Remedy.objects.filter(is_approved=False).count(),
        "approved": Remedy.objects.filter(is_approved=True).count()
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_remedy(request):
    user_input = {
        "title": request.data.get("title", ""),
        "description": request.data.get("description", ""),
        "ingredients": request.data.get("ingredients", ""),
        "preparation": request.data.get("preparation", ""),
        "benefits": request.data.get("health_benefits", ""),
    }

    # 🧠 Construct raw prompt from structured fields
    raw_combined = f"""
    Title: {user_input['title']}
    Description: {user_input['description']}
    Ingredients: {user_input['ingredients']}
    Preparation: {user_input['preparation']}
    Health Benefits: {user_input['benefits']}
    """

    # ✨ Clean using Gemini
    cleaned = ai_remedy_cleaner(raw_combined)

    if not cleaned or not cleaned.get("title"):
        return Response({'error': 'AI cleaning failed or returned incomplete result.'}, status=500)

    from .models import Category  # in case needed inline
    category_name = request.data.get("category", "General Wellness").strip()
    category, _ = Category.objects.get_or_create(name=category_name)

    remedy_data = {
        "title": cleaned["title"],
        "slug": slugify(cleaned["title"])[:200],
        "description": cleaned.get("description", "A natural home remedy."),
        "ingredients": "\n".join(cleaned.get("ingredients", [])),
        "preparation": "\n".join(cleaned.get("preparation", [])),
        "health_benefits": "\n".join(cleaned.get("benefits", [])),
        "image": request.data.get("image", ""),  # Safe fallback
        "category": category.id,
        "created_by": request.user.id,
        "is_approved": False,
        "ai_cleaned": True,
    }

    serializer = RemedyDetailSerializer(data=remedy_data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': '✅ Remedy cleaned and submitted successfully!'}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def preview_cleaned_remedy(request):
    user_input = {
        "title": request.data.get("title", ""),
        "description": request.data.get("description", ""),
        "ingredients": request.data.get("ingredients", ""),
        "preparation": request.data.get("preparation", ""),
        "benefits": request.data.get("health_benefits", ""),
    }

    raw_combined = f"""
    Title: {user_input['title']}
    Description: {user_input['description']}
    Ingredients: {user_input['ingredients']}
    Preparation: {user_input['preparation']}
    Health Benefits: {user_input['benefits']}
    """

    cleaned = ai_remedy_cleaner(raw_combined)

    if not cleaned or not cleaned.get("title"):
        # fallback to user input
        return Response({
            "ai_cleaned": False,
            "title": user_input['title'],
            "description": user_input['description'],
            "ingredients": user_input['ingredients'],
            "preparation": user_input['preparation'],
            "health_benefits": user_input['benefits'],
        }, status=200)

    return Response({
        "ai_cleaned": True,
        "title": cleaned["title"],
        "description": cleaned.get("description"),
        "ingredients": "\n".join(cleaned.get("ingredients", [])),
        "preparation": "\n".join(cleaned.get("preparation", [])),
        "health_benefits": "\n".join(cleaned.get("benefits", [])),
    }, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_submissions(request):
    remedies = request.user.submitted_remedies.all()
    serializer = RemedyListSerializer(remedies, many=True)
    return Response(serializer.data)

