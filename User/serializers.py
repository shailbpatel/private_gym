from rest_framework.serializers import ModelSerializer
from User.models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields=('id', 'fname', 'lname', 'email', 'phone')