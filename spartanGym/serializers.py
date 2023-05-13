from rest_framework.serializers import ModelSerializer
from Gym.models import Location, Equipment

class LocationSerializer(ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class EquipmentSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'