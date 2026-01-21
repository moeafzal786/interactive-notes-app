from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),

    # ✅ All API routes (auth + notes) live inside api/urls
    path('api/', include('api.urls')),

    # JWT endpoints (still available here if you want direct access)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]