from django.urls import path
from .views import signup, login, logout, my_submissions

urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('logout/', logout),
    path('my-submissions/', my_submissions),
]

