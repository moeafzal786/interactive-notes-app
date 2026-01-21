from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    UsernameTokenObtainPairView,
    RegisterView,
    ForgotPasswordView,
    ResetPasswordView,
    NoteViewSet,
)

# ✅ Router for notes CRUD
router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    # Auth endpoints
    path('token/', UsernameTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('password-reset/', ForgotPasswordView.as_view(), name='password_reset'),
    path('password-reset-confirm/', ResetPasswordView.as_view(), name='password_reset_confirm'),

    # ✅ Notes endpoints directly under /api/
    path('', include(router.urls)),
]