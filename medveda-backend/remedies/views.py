from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.postgres.search import SearchVector, SearchQuery

from .models import Remedy, Category
from .serializers import (
    RemedyListSerializer,
    RemedyDetailSerializer,
    CategorySerializer,
)


# ——— Search endpoint ————————————————————————————
@api_view(['GET'])
def search_remedies(request):
    query      = request.GET.get('q', '')
    category   = request.GET.get('category')
    min_rating = request.GET.get('min_rating')

    qs = Remedy.objects.filter(is_verified=True)

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
