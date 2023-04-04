from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout, get_user

from User.serializers import UserSerializer
from User.models import User


@api_view(['POST'])
def login_view(request):
    user = get_user(request)
    if user.is_authenticated():
        return JsonResponse({'success': True, 'data': UserSerializer(user).data, 'error': ''})

    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    data = UserSerializer(user).data
    if user is not None:
        login(request, user)
        return JsonResponse({'success': True, 'data': data, 'error': ''})


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True, 'error': ''})


@api_view(['GET'])
def get_user_details(request):
    user = get_user(request)
    if not user.is_authenticated():
        return JsonResponse(status=status.HTTP_401_UNAUTHORIZED, data={'success': False, 'error': 'User not logged in'})

    return JsonResponse(status=status.HTTP_200_OK, data={'success': True, 'data': UserSerializer(user).data, 'error': ''})


@api_view(['POST'])
def signup(request):
    phone = request.data.get('phone')
    password = request.data.get('password')
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    user = User.objects.create_user(phone=phone, password=password, email=email, fname=first_name, lname=last_name)
    user.save()
    token = Token.objects.create(user=user)
    return JsonResponse(status=status.HTTP_200_OK, data={'success': True, 'error': '', 'token': token.key, 'data': UserSerializer(user).data})