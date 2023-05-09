from rest_framework.serializers import ModelSerializer
from Daily.models import Entry

class EntrySerializer(ModelSerializer):
    class Meta:
        model = Entry
        fields = ('id', 'user', 'location', 'checkin_time', 'checkout_time', 'has_checked_out', 'duration',)