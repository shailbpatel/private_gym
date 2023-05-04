from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

class CustomTokenAuthentication(TokenAuthentication):
    model = User

    def authenticate_credentials(self, key):
        try:
            user = self.model.objects.get(auth_token=key)
        except self.model.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

        if not user.is_active:
            raise AuthenticationFailed('User inactive or deleted')

        return (user, None)

    def authenticate(self, request, **credentials):
        username = credentials.get('username')
        password = credentials.get('password')

        if not username or not password:
            return None

        try:
            user = User.objects.get(phone=username)
        except User.DoesNotExist:
            return None

        if not user.check_password(password):
            return None

        if not user.is_active:
            return None

        return (user, None)