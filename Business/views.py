from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.http import JsonResponse
from django.utils import timezone
from datetime import datetime, timedelta

from Business.models import Plan, Class
from Business.serializers import PlanSerializer, ClassSerializer
from User.models import Enrolled


def get_classes(request, location_id):
    try:
        one_week_from_now = datetime.now() + timedelta(days=7)
        classes = Class.objects.filter(location_id=location_id, time__gte=timezone.now(), time__lte=one_week_from_now)
        data = ClassSerializer(classes, many=True).data
        return JsonResponse({'success': True, 'data': data, 'error': ''})
    except Exception as e:
        return JsonResponse({'success': False, 'data': {}, 'error': str(e)})


@api_view(['GET'])
def get_plans(request):
    try:
        plans = Plan.objects.all().order_by('-price')
        data = PlanSerializer(plans, many=True).data
        return JsonResponse({'success': True, 'data': data, 'error': ''})
    except Exception as e:
        return JsonResponse({'success': False, 'data': {}, 'error': str(e)})