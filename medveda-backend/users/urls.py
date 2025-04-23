from django.urls import path
from .views import signup,  logout, CustomTokenObtainPairView
from remedies.views import get_saved_remedies
urlpatterns = [
    path('signup/', signup),
    path('logout/', logout),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('saved-remedies/', get_saved_remedies),
]

