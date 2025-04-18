from django.urls import path
from .views import search_remedies, category_list, RemedyDetailView, create_review, ReviewUpdateDeleteView,RemedyReviewsView

urlpatterns = [
    path('search/', search_remedies, name='search-remedies'),
    path('categories/', category_list),
     path('<slug:slug>/', RemedyDetailView.as_view(), name='remedy-detail'),
     path('remedies/<slug:slug>/reviews/', create_review, name='create-review'),
     path('reviews/<int:pk>/', ReviewUpdateDeleteView.as_view(), name='review-update-delete'),
path('remedies/<slug:slug>/reviews/', RemedyReviewsView.as_view(), name='remedy-reviews'),

]
