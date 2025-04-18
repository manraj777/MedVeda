from rest_framework import generics, permissions
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
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

)
from .permissions import IsReviewAuthorOrReadOnly


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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_remedy(request):
    data = request.data.copy()
    data['created_by'] = request.user.id
    data['is_approved'] = False  # mark as pending

    serializer = RemedyDetailSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Remedy submitted successfully!'}, status=201)
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