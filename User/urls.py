from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

from User.views import login_view, logout_view

urlpatterns = [
    url('login', csrf_exempt(login_view)),
    url('logout', csrf_exempt(logout_view)),
]