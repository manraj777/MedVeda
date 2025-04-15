from django.urls import path
from .views import search_remedies, category_list

urlpatterns = [
    path('search/', search_remedies, name='search-remedies'),
    path('categories/', category_list),
]
