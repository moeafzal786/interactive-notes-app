from rest_framework import serializers, viewsets, permissions, generics, status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Note
from .serializers import NoteSerializer

# --- Custom JWT Serializer for username login ---
class UsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid username or password")

        data = super().validate(attrs)
        data["username"] = user.username
        return data


class UsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = UsernameTokenObtainPairSerializer


# --- Register View ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    class RegisterSerializer(serializers.ModelSerializer):
        password = serializers.CharField(write_only=True)

        class Meta:
            model = User
            fields = ['username', 'email', 'password']

        def create(self, validated_data):
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data.get('email', ''),
                password=validated_data['password']
            )
            return user

    serializer_class = RegisterSerializer


# --- Forgot Password (dummy for now, extend with email sending) ---
class ForgotPasswordView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        # TODO: implement email sending with reset link
        return Response({"message": f"Reset link sent to {email}"}, status=status.HTTP_200_OK)


# --- Reset Password Confirmation ---
class ResetPasswordView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        new_password = request.data.get("password")
        try:
            user = User.objects.get(username=username)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)


# --- Notes ViewSet ---
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return notes belonging to the logged-in user
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # ✅ Ensure the note is linked to the logged-in user
        serializer.save(user=self.request.user)