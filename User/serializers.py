from rest_framework.serializers import ModelSerializer
from User.models import User, Enrolled
from Business.serializers import ClassSerializer

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields=('id', 'fname', 'lname', 'email', 'phone')


class EnrolledSerializer(ModelSerializer):
    enrolled_class = ClassSerializer()
    class Meta:
        model = Enrolled
        fields = ('enrolled_class',)