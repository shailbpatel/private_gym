from Daily.models import Entry, GymUsage
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from Daily.serializers import EntrySerializer
from django.http import JsonResponse
from User.models import User
from Gym.models import Location, Equipment
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from datetime import datetime


# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_in(request):
    if(request.user.role != 0):
        return JsonResponse({'success': False, 'error': ""}, status=status.HTTP_403_FORBIDDEN)
    user_phone = request.data.get('user_phone')
    location_id = request.data.get('location_id')
    user = get_object_or_404(User, phone=user_phone)
    if user.role == 2:
        return JsonResponse({'success': False, 'error': 'User is not a member'}, status=status.HTTP_400_BAD_REQUEST)
    location = get_object_or_404(Location, pk=location_id)
    existing_entry = Entry.objects.filter(user=user, location=location, checkout_time=None)
    if existing_entry:
        return JsonResponse({'success': False, 'error': 'User is already checked in'}, status=status.HTTP_400_BAD_REQUEST)
    entry = Entry.objects.create(user=user, location=location)
    serializer = EntrySerializer(entry)
    return JsonResponse({'success': True, 'data': serializer.data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_out(request):
    if(request.user.role != 0):
        return JsonResponse({'success': False, 'error': ""}, status=status.HTTP_403_FORBIDDEN)
    user_phone = request.data.get('user_phone')
    location_id = request.data.get('location_id')
    user = get_object_or_404(User, phone=user_phone)
    if user.role == 2:
        return JsonResponse({'success': False, 'error': 'User is not a member'}, status=status.HTTP_400_BAD_REQUEST)
    location = get_object_or_404(Location, pk=location_id)
    last_entry = Entry.objects.filter(user=user, location=location).order_by('-checkin_time').first()

    if not last_entry or last_entry.has_checked_out:
        return JsonResponse({'success': False, 'error': 'User is not checked in at this location'}, status=status.HTTP_400_BAD_REQUEST)

    last_entry.checkout_time = timezone.now()
    last_entry.save()
    serializer = EntrySerializer(last_entry)
    return JsonResponse({'success': True, 'data': serializer.data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_activity(request):
    user = request.user
    equipment_name = request.data.get('equipment_id')
    hours = request.data.get('hours')
    try:
        equipment = Equipment.objects.get(name=equipment_name)
    except:
        return JsonResponse({'success': False, 'error': 'Equipment not found'})
    if user.role == 2:
        return JsonResponse({'success': False, 'error': 'User is not a member'})
    last_entry = Entry.objects.filter(user=user, location=location).order_by('-checkin_time').first()
    if not last_entry or last_entry.has_checked_out:
        return JsonResponse({'success': False, 'error': 'User is not checked in at this location'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        location = Location.objects.get(pk=last_entry.location.id)
    except:
        return JsonResponse({'success': False, 'error': 'User is not checked in at this location'})

    gym_usage = GymUsage.objects.create(entry=last_entry, equipment=equipment, hours=hours)
    return JsonResponse({'success': True, 'data': 'Activity logged successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def hours_count(request):
    def byDay(data):
        count = 24*[0]
        for entry in data:
            count[entry.checkin_time.hour] += entry.duration//3600
        return count

    def byWeekday(data):
        count = 7*[0]
        for entry in data:
            count[entry.checkin_time.weekday()] += entry.duration//3600
        return count[:5]


    def byWeekend(data):
        count = 7*[0]
        for entry in data:
            count[entry.checkin_time.weekday()] += entry.duration//3600
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

    # Count check-ins by each hour
    entries = Entry.objects.filter(
        location=location,
        checkin_time__gte=start_date,
    )
    entries = entries.filter(checkout_time__isnull=False)
    response = {}
    response['dataByDay'] = {}
    day_labels = [str(i) for i in range(0, 24)]
    response['dataByDay']['labels'] = day_labels
    datasets = [{
        'label': 'Gym Hours by Hour',
        'data': byDay(entries),
        'borderColor': '#BC544b',
    }]
    response['dataByDay']['datasets'] = datasets
    
    response['dataByWeekday'] = {}
    weekday_labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    response['dataByWeekday']['labels'] = weekday_labels
    datasets = [{
        'label': 'Gym Hours by Weekday',
        'data': byWeekday(entries),
        'borderColor': '#BC544b',
    }]
    response['dataByWeekday']['datasets'] = datasets
    
    response['dataByWeekend'] = {}
    weekend_labels = ['Saturday', 'Sunday']
    response['dataByWeekend']['labels'] = weekend_labels
    datasets = [{
        'label': 'Gym Hours by Weekend',
        'data': byWeekend(entries),
        'borderColor': '#BC544b',
    }]
    response['dataByWeekend']['datasets'] = datasets

    return JsonResponse(
        response
    )


@api_view(['POST'])
def check_in_counts(request):

    def byDay(data):
        count = 24*[0]
        for entry in data:
            count[entry.checkin_time.hour] += 1
        return count

    def byWeekday(data):
        count = 7*[0]
        for entry in data:
            count[entry.checkin_time.weekday()] += 1
        return count[:5]


    def byWeekend(data):
        count = 7*[0]
        for entry in data:
            count[entry.checkin_time.weekday()] += 1
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

    # Count check-ins by each hour
    entries = Entry.objects.filter(
        location=location,
        checkin_time__gte=start_date,
    )
    response = {}
    response['dataByDay'] = {}
    day_labels = [str(i) for i in range(0, 24)]
    response['dataByDay']['labels'] = day_labels
    datasets = [{
        'label': 'Check-ins by Hour',
        'data': byDay(entries),
        'backgroundColor': '#3e95cd',
    }]
    response['dataByDay']['datasets'] = datasets
    
    response['dataByWeekday'] = {}
    weekday_labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    response['dataByWeekday']['labels'] = weekday_labels
    datasets = [{
        'label': 'Check-ins by Weekday',
        'data': byWeekday(entries),
        'backgroundColor': '#3e95cd',
    }]
    response['dataByWeekday']['datasets'] = datasets
    
    response['dataByWeekend'] = {}
    weekend_labels = ['Saturday', 'Sunday']
    response['dataByWeekend']['labels'] = weekend_labels
    datasets = [{
        'label': 'Check-ins by Weekend',
        'data': byWeekend(entries),
        'backgroundColor': '#3e95cd',
    }]
    response['dataByWeekend']['datasets'] = datasets

    return JsonResponse(
        response
    )