from django.urls import path
from .views import (search_remedies, category_list,
                     RemedyDetailView, create_review, 
                     ReviewUpdateDeleteView,RemedyReviewsView,
                     my_submissions,submit_remedy,submit_remedy_raw,
                     save_remedy, unsave_remedy,preview_cleaned_remedy,
                     approve_remedy, pending_remedies,delete_remedy
)
urlpatterns = [
    # ✅ Put these first
    path('submit/', submit_remedy, name='submit-remedy'),
    path('submit-raw/', submit_remedy_raw, name='submit-remedy-raw'),
    path('preview-cleaned/', preview_cleaned_remedy, name='preview-remedy'),
    path('my-submissions/', my_submissions, name='my-submissions'),
    path('admin/pending/', pending_remedies, name='pending-remedies'),
    path('admin/approve/<int:remedy_id>/', approve_remedy, name='approve-remedy'),
    path('admin/delete/<int:remedy_id>/', delete_remedy),
    path('saved/<int:remedy_id>/', save_remedy, name='save-remedy'),
    path('saved/<int:remedy_id>/', unsave_remedy, name='unsave-remedy'),
    path('categories/', category_list),
    path('search/', search_remedies, name='search-remedies'),
    path('my-submissions/', my_submissions, name='my-submissions'),
    path('reviews/<int:remedy_id>/', ReviewUpdateDeleteView.as_view(), name='review-detail'),


    # ✅ Only slug-based views at the end
    path('<slug:slug>/add-review/', create_review, name='create-review'),
    path('<slug:slug>/reviews/', RemedyReviewsView.as_view(), name='remedy-reviews'),
    path('<slug:slug>/', RemedyDetailView.as_view(), name='remedy-detail'),
]
