from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout

from User.serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, authentication_classes
from User.backends import CustomTokenAuthentication
from User.models import User


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