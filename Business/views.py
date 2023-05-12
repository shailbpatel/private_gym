from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.http import JsonResponse
from django.utils import timezone
from datetime import datetime, timedelta

from Business.models import Plan, Class
from Business.serializers import PlanSerializer, ClassSerializer
from User.models import Enrolled
from django.shortcuts import get_object_or_404
from Gym.models import Location


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
    

@api_view(['POST'])
def get_classes_enrollment(request):
    def byDay(data):
        count = 24*[0]
        for classs in data:
            count[classs.time.hour] += 1
        return count

    def byWeekday(data):
        count = 7*[0]
        for entry in data:
            count[entry.time.weekday()] += 1
        return count[:5]


    def byWeekend(data):
        count = 7*[0]
        for entry in data:
            count[entry.time.weekday()] += 1
        return count[5:]
    
    def byDayPeople(data):
        count = 24*[0]
        for classs in data:
            count[classs.time.hour] += classs.spots_filled()
        return count

    def byWeekdayPeople(data):
        count = 7*[0]
        for entry in data:
            count[entry.time.weekday()] += entry.spots_filled()
        return count[:5]


    def byWeekendPeople(data):
        count = 7*[0]
        for entry in data:
            count[entry.time.weekday()] += entry.spots_filled()
        return count[5:]
    
    location_id = request.data.get('location_id')
    start_date = request.data.get('start_time')
    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = request.data.get('end_time')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')

    if location_id:
        location = get_object_or_404(Location, pk=location_id)
    else:
        location = None

    classes = Class.objects.filter(location=location, time__gte=start_date, time__lte=end_date)
    response = {}
    response['dataByDay'] = {}
    day_labels = [str(i) for i in range(0, 24)]
    response['dataByDay']['labels'] = day_labels
    datasets = [{
        'label': 'No of classes by Hour',
        'data': byDay(classes),
        'backgroundColor': '#BC544b',
    },{
        'label': 'Enrollment by Hour',
        'data': byDayPeople(classes),
        'backgroundColor': '#BC544b',
    }]
    response['dataByDay']['datasets'] = datasets
    
    response['dataByWeekday'] = {}
    weekday_labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    response['dataByWeekday']['labels'] = weekday_labels
    datasets = [{
        'label': 'No of classes by Weekday',
        'data': byWeekday(classes),
        'backgroundColor': '#BC544b',
    },
    {
        'label': 'Enrollment by Weekday',
        'data': byWeekdayPeople(classes),
        'backgroundColor': '#BC544b',
    }]
    response['dataByWeekday']['datasets'] = datasets
    
    response['dataByWeekend'] = {}
    weekend_labels = ['Saturday', 'Sunday']
    response['dataByWeekend']['labels'] = weekend_labels
    datasets = [{
        'label': 'No of classes by Weekend',
        'data': byWeekend(classes),
        'backgroundColor': '#BC544b',
    },{
        'label': 'Enrollment by Weekend',
        'data': byWeekendPeople(classes),
        'backgroundColor': '#BC544b',
    }]
    response['dataByWeekend']['datasets'] = datasets

    return JsonResponse(
        response
    )