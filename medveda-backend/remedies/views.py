from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.postgres.search import SearchVector, SearchQuery
from .models import Remedy
from .serializers import RemedySerializer, CategorySerializer

@api_view(['GET'])
def search_remedies(request):
    query = request.GET.get('q', '')
    category = request.GET.get('category')
    min_rating = request.GET.get('min_rating')

    remedies = Remedy.objects.filter(is_verified=True)

    if query:
        remedies = remedies.annotate(
            search=SearchVector('title', 'description', 'ingredients')
        ).filter(search=SearchQuery(query))

    if category:
        remedies = remedies.filter(category__slug=category)

    if min_rating:
        remedies = remedies.filter(rating__gte=float(min_rating))

    paginator = PageNumberPagination()
    paginator.page_size = 6
    paginated = paginator.paginate_queryset(remedies, request)

    serializer = RemedySerializer(paginated, many=True)
    return paginator.get_paginated_response(serializer.data)



@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)