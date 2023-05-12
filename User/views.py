from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.utils.timezone import now, timedelta

from User.serializers import UserSerializer, EnrolledSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, authentication_classes
from User.backends import CustomTokenAuthentication
from User.models import User, Enrolled
from Business.models import Class, Plan
from Daily.models import GymUsage, Entry


@authentication_classes([CustomTokenAuthentication])
@api_view(['POST'])
def login_view(request):
    if request.user.is_authenticated():
        return JsonResponse({'success': True, 'data': UserSerializer(request.user).data, 'error': ''})

    username = request.data.get('phone')
    password = request.data.get('password')
    user = authenticate(request=request, username=username, password=password)
    if user is None:
        return JsonResponse(status=status.HTTP_401_UNAUTHORIZED, data={'success': False, 'data': {}, 'error': 'Incorrect username or password'})
   
    data = UserSerializer(user).data 
    login(request, user)
    token = Token.objects.get_or_create(user=user)
    data["token"] = token[0].key
    return JsonResponse({'success': True, 'data': data, 'error': ''})


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True, 'error': ''})


@authentication_classes([CustomTokenAuthentication])
@api_view(['GET'])
def get_user_details(request):
    if not request.user.is_authenticated():
        return JsonResponse(status=status.HTTP_401_UNAUTHORIZED, data={'success': False, 'error': 'User not logged in'})

    return JsonResponse(status=status.HTTP_200_OK, data={'success': True, 'data': UserSerializer(request.user).data, 'error': ''})


@api_view(['POST'])
def signup(request):
    phone = request.data.get('phone')
    password = request.data.get('password')
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    try:
        user = User.objects.create_user(phone=phone, password=password, email=email, fname=first_name, lname=last_name)
        user.save()
        token = Token.objects.create(user=user)
    
        return JsonResponse(status=status.HTTP_200_OK, data={'success': True, 'error': '', 'token': token.key, 'data': UserSerializer(user).data})
    except Exception as e:
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST, data={'success': False, 'error': str(e)})
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_class(request):
    user = request.user
    class_id = request.data.get('class_id')

    try:
        enrolled_class = Class.objects.get(pk=class_id)
    except Class.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Invalid class ID'})

    if enrolled_class.spots_left() == 0:
        return JsonResponse({'success': False, 'error': 'No spots left in this class'})

    try:
        Enrolled.objects.create(user=user, enrolled_class=enrolled_class)
        enrolled_classes = Enrolled.objects.filter(user=user)
        data = EnrolledSerializer(enrolled_classes, many=True).data
        formatted_data = [i['enrolled_class'] for i in data]
        return JsonResponse({'success': True, 'error': '', 'data': formatted_data})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e), 'data': []})
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_enrolled_classes(request):
    user = request.user
    enrolled_classes = Enrolled.objects.filter(user=user)
    data = EnrolledSerializer(enrolled_classes, many=True).data
    formatted_data = [i['enrolled_class'] for i in data]
    return JsonResponse({'success': True, 'error': '', 'data': formatted_data})


@api_view(['POST'])
def enroll_member(request):
    phone = request.data.get('phone', None)
    plan_id = request.data.get('plan_id', None)
    if phone is None:
        return JsonResponse({'success': False, 'error': 'Phone number is required.'})
    try:
        user = User.objects.get(phone=phone)
        if(user.role == 0):
            return JsonResponse({'success': False, 'error': 'Cannot convert admin to member.'})
        user.role = 1
        plan = Plan.objects.get(pk=plan_id)
        user.expiry_date = now() + timedelta(days=plan.duration)
        user.save()
        return JsonResponse({'success': True, 'error': ''}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Create a non-member account first.'}, status=status.HTTP_200_OK)
    except Plan.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Select a valid Membership Plan.'}, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_past_activity(request):
    user = request.user
    all_data = []
    enrolled_classes = Enrolled.objects.filter(user=user)

    for enrolled_class in enrolled_classes:
        all_data.append({
            'name': enrolled_class.enrolled_class.name,
            'time': enrolled_class.enrolled_class.time,
            'location': enrolled_class.enrolled_class.location.name
        })

    entry_data = Entry.objects.filter(user=user)
    for entry in entry_data:
        temp_data = {
            'name': "Check-in",
            'time': entry.checkin_time,
            'location': entry.location.name,
            'usage': [],
            'checkout': ''
        }

        usage_data = GymUsage.objects.filter(entry=entry_data)
        for usage in usage_data:
            temp_data['usage'].append({
                'name': usage.equipment.name,
            })

        if entry.has_checked_out:
            temp_data['checkout'] = entry.checkout_time
    
        all_data.append(temp_data)
    all_data = sorted(all_data, key=lambda k: k['time'], reverse=True)
    return JsonResponse({'success': True, 'error': '', 'data': all_data})
