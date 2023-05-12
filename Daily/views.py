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
    location_id = request.data.get('location_id')
    equipment_id = request.data.get('equipment_id')
    equipment = get_object_or_404(Equipment, pk=equipment_id)
    if user.role == 2:
        return JsonResponse({'success': False, 'error': 'User is not a member'}, status=status.HTTP_400_BAD_REQUEST)
    location = get_object_or_404(Location, pk=location_id)
    last_entry = Entry.objects.filter(user=user, location=location).order_by('-checkin_time').first()

    if not last_entry or last_entry.has_checked_out:
        return JsonResponse({'success': False, 'error': 'User is not checked in at this location'}, status=status.HTTP_400_BAD_REQUEST)

    gym_usage = GymUsage.objects.create(entry=last_entry, equipment=equipment)
    return JsonResponse({'success': True, 'data': 'Activity logged successfully'}, status=status.HTTP_200_OK)