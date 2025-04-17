from django.urls import path
from .views import search_remedies, category_list, RemedyDetailView

urlpatterns = [
    path('search/', search_remedies, name='search-remedies'),
    path('categories/', category_list),
     path('<slug:slug>/', RemedyDetailView.as_view(), name='remedy-detail'),
]
