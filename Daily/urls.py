from django.conf.urls import url
from Daily import views

urlpatterns = [
    url(r'^checkin', views.check_in),
    url(r'^checkout', views.check_out),
    url(r'log_activity', views.log_activity),
    url(r'get_checkins', views.check_in_counts),
    url(r'get_hours', views.hours_count),
]