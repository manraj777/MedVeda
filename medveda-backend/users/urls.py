from django.urls import path
from .views import signup, login, logout, CustomTokenObtainPairView
from remedies.views import get_saved_remedies
urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('logout/', logout),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('saved-remedies/', get_saved_remedies),
]

