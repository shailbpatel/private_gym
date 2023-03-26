from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse

from User.serializers import UserSerializer


@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':

        if request.user.is_authenticated():
            return JsonResponse({'success': True, 'user_data': UserSerializer(request.user).data})
 
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        data = UserSerializer(user).data
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'user_data': data})

    return JsonResponse({'success': False})


@api_view(['POST'])
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True})

    return JsonResponse({'success': False})