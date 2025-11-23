from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.serializers import UserSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    Migrated from Laravel AuthController::register
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = (
            'phone',
            'first_name',
            'email',
            'password',
            'password_confirm',
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        # Use custom manager's create_user method
        user = User.objects.create_user(
            phone=validated_data.pop('phone'),
            first_name=validated_data.pop('first_name'),
            password=password,
            **validated_data
        )

        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    Supports both phone and email authentication
    """
    phone = serializers.CharField(required=False, allow_blank=True)
    email = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        phone = attrs.get('phone')
        email = attrs.get('email')
        password = attrs.get('password')

        # Check that at least one identifier is provided
        if not phone and not email:
            raise serializers.ValidationError(
                'Must include either "phone" or "email".',
                code='authorization'
            )

        if not password:
            raise serializers.ValidationError(
                'Must include "password".',
                code='authorization'
            )

        # Try to find user by phone or email
        user = None

        if phone:
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                pass

        if not user and email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                pass

        # Validate user exists
        if not user:
            raise serializers.ValidationError(
                'Unable to log in with provided credentials.',
                code='authorization'
            )

        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError(
                'Unable to log in with provided credentials.',
                code='authorization'
            )

        # Check if user is active
        if not user.is_active:
            raise serializers.ValidationError(
                'User account is disabled.',
                code='authorization'
            )

        attrs['user'] = user
        return attrs


class TokenResponseSerializer(serializers.Serializer):
    """
    Serializer for token response
    """
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()


class LogoutSerializer(serializers.Serializer):
    """
    Serializer for logout
    Migrated from Laravel AuthController::logout
    """
    refresh = serializers.CharField(required=False)

    def validate(self, attrs):
        self.token = attrs.get('refresh')
        return attrs

    def save(self, **kwargs):
        if self.token:
            try:
                RefreshToken(self.token).blacklist()
            except Exception:
                pass
