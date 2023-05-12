from rest_framework.serializers import ModelSerializer
from Business.models import Plan, Class, Instructor
from rest_framework import serializers


class PlanSerializer(ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class ClassSerializer(ModelSerializer):
    instructor = serializers.CharField(source='instructor.name')
    location = serializers.CharField(source='location.name')

    class Meta:
        model = Class
        fields = ('id', 'name', 'strength', 'time', 'instructor', 'spots_left', 'location')