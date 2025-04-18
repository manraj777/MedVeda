from django.urls import path
from .views import (search_remedies, category_list,
                     RemedyDetailView, create_review, 
                     ReviewUpdateDeleteView,RemedyReviewsView,
                     get_saved_remedies,submit_remedy,
                     save_remedy, unsave_remedy
)

urlpatterns = [
    path('search/', search_remedies, name='search-remedies'),
    path('categories/', category_list),
     path('<slug:slug>/', RemedyDetailView.as_view(), name='remedy-detail'),
     path('remedies/<slug:slug>/reviews/', create_review, name='create-review'),
     path('reviews/<int:pk>/', ReviewUpdateDeleteView.as_view(), name='review-update-delete'),
path('remedies/<slug:slug>/reviews/', RemedyReviewsView.as_view(), name='remedy-reviews'),
path('users/saved/', get_saved_remedies),
path('remedies/submit/', submit_remedy),
path('saved/<int:remedy_id>/', save_remedy, name='save-remedy'),
path('saved/<int:remedy_id>/', unsave_remedy, name='unsave-remedy'),



]
