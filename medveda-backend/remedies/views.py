from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.postgres.search import SearchVector, SearchQuery
from .utils import update_remedy_rating
from .models import Remedy, Category, Review
from .serializers import (
    RemedyListSerializer,
    RemedyDetailSerializer,
    CategorySerializer,
    ReviewSerializer
)


# ——— Search endpoint ————————————————————————————
@api_view(['GET'])
def search_remedies(request):
    query      = request.GET.get('q', '')
    category   = request.GET.get('category')
    min_rating = request.GET.get('min_rating')

    qs = Remedy.objects.filter()

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
def create_review(request, slug):
    try:
        remedy = Remedy.objects.get(slug=slug)
    except Remedy.DoesNotExist:
        return Response({'error': 'Remedy not found'}, status=404)

    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(remedy=remedy, user=request.user if request.user.is_authenticated else None)
        update_remedy_rating(remedy)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class ReviewUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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
