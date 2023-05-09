from django.db import models
from django.utils import timezone
from Gym.models import Equipment

# Create your models here.
class Entry(models.Model):
    user = models.ForeignKey(
        'User.User', on_delete=models.DO_NOTHING)
    location = models.ForeignKey(
        'Gym.Location', on_delete=models.DO_NOTHING)
    checkin_time = models.DateTimeField(default=timezone.now)
    checkout_time = models.DateTimeField(null=True, blank=True)

    @property
    def has_checked_out(self):
        if self.checkout_time:
            return True
        return False

    @property
    def duration(self):
        if not self.has_checked_out:
            return None
        seconds = (self.checkout_time - self.checkin_time).total_seconds()
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        return '{} hour{}, {} minute{}'.format(hours, 's' if hours != 1 else '',
                                                minutes, 's' if minutes != 1 else '')
    

class GymUsage(models.Model):
    entry = models.ForeignKey(
        'Daily.Entry', on_delete=models.DO_NOTHING)
    equipment = models.ForeignKey(
        'Gym.Equipment', on_delete=models.DO_NOTHING)