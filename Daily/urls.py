from django.conf.urls import url
from Daily import views

urlpatterns = [
    url(r'^checkin', views.check_in),
    url(r'^checkout', views.check_out),
]