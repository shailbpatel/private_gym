from rest_framework.serializers import ModelSerializer
from Business.models import Plan, Class, Instructor
from rest_framework import serializers


class PlanSerializer(ModelSerializer):
    class Meta:
        model = Plan
        exclude = ('id',)

class ClassSerializer(ModelSerializer):
    instructor = serializers.CharField(source='instructor.name')

    class Meta:
        model = Class
        fields = ('name', 'strength', 'time', 'instructor',)