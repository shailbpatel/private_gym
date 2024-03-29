from django.conf.urls import url
from rest_framework.authtoken.views import obtain_auth_token

from User import views


urlpatterns = [
    url('login', views.login_view),
    url('logout', views.logout_view),
    url('token', obtain_auth_token),
    url('details', views.get_user_details),
    url('signup', views.signup),
    url('enroll_class', views.enroll_class),
    url('classes', views.get_enrolled_classes),
    url('enroll_member', views.enroll_member),
    url('past_activity', views.get_past_activity),
]