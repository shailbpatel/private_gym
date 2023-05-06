from django.conf.urls import url
from Business import views

urlpatterns = [
    url(r'plans/', views.get_plans),
    url(r'location/(?P<location_id>\d+)/classes/$', views.get_classes),
]