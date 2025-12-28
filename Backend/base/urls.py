from django.urls import path
from django.contrib import admin
from django.urls import include
from .views import (
    get_todos,
    logout,
    register,
    is_logged_in,
    checkout,
    CustomTokenObtainPairView,
    CustomTokenRefreshView
)

urlpatterns = [
    path('logout/', logout, name='logout'),
    path('todos/', get_todos, name='todos'),
    path('register/', register, name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('authenticated/', is_logged_in, name='authenticated'),
    path('checkout/', checkout, name='checkout'),
]
