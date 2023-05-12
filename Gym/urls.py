from django.conf.urls import url
from Gym import views

urlpatterns = [
    url(r'locations/', views.get_locations),
    url(r'equipments/', views.get_equipments),
]