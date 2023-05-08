from rest_framework.serializers import ModelSerializer
from User.models import User, Enrolled
from Business.serializers import ClassSerializer
from rest_framework import serializers
from django.utils import timezone

class UserSerializer(ModelSerializer):
    role = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields=('id', 'fname', 'lname', 'email', 'phone', 'role',)

    def get_role(self, obj):
        if obj.role == 0:
            return 'admin'
        elif obj.role == 1 and obj.expiry_date and obj.expiry_date > timezone.now():
            return 'member'
        else:
            return 'non-member'


class EnrolledSerializer(ModelSerializer):
    enrolled_class = ClassSerializer()
    class Meta:
        model = Enrolled
        fields = ('enrolled_class',)