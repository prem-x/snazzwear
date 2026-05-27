from django.urls import path
from .views import HomeView, signup

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('signup/', signup, name='signup'),
]