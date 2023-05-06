from django.conf.urls import url
from Gym import views

urlpatterns = [
    url(r'locations/', views.get_locations),
]