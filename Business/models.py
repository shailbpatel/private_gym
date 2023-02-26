from django.db import models
import datetime

# Create your models here.
class Instructor(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=10, null=True, blank=True, unique=True)

    def __str__(self):
        return self.name


class Class(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    strength = models.IntegerField(default=20)
    instructor = models.ForeignKey(
        'Business.Instructor', on_delete=models.CASCADE)
    time = models.DateTimeField()
    location = models.ForeignKey(
        'Gym.Location', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name


class Plan(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=True, null=True)
    price = models.IntegerField()
    duration = models.IntegerField(help_text="duration in days") # duration in days

    def __str__(self):
        return self.name


class Membership(models.Model):
    plan = models.ForeignKey(
        'Business.Plan', on_delete=models.CASCADE)
    user = models.ForeignKey(
        'User.User', on_delete=models.CASCADE)
    location = models.ForeignKey(
        'Gym.Location', on_delete=models.CASCADE)
    start_date = models.DateField(default=datetime.date.today)

    def __str__(self):
        return self.plan + ' ' + self.user + ' ' + self.location

    def get_expiry_date(self):
        current_date = datetime.date.today()
        return current_date + datetime.timedelta(days=self.plan.duration)

    @property
    def has_expired(self):
        return datetime.date.today() >= self.get_expiry_date()
