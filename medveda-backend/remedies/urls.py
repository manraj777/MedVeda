from django.urls import path
from .views import search_remedies, category_list, RemedyDetailView, create_review

urlpatterns = [
    path('search/', search_remedies, name='search-remedies'),
    path('categories/', category_list),
     path('<slug:slug>/', RemedyDetailView, name='remedy-detail'),
     path('remedies/<slug:slug>/reviews/', create_review, name='create-review'),
]
