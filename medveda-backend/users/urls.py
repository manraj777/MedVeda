from django.urls import path
from .views import signup, login, logout, my_submissions, CustomTokenObtainPairView
from remedies.views import submit_remedy
urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('logout/', logout),
    path('my-submissions/', my_submissions),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('submit/', submit_remedy),
]

