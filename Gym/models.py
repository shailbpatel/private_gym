from django.db import models
from localflavor.us.models import USStateField
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator


# Create your models here.
class Location(models.Model):
    name = models.CharField(unique=True, max_length=50)
    street = models.CharField(unique=True, max_length=200)
    city = models.CharField(max_length=100)
    state = USStateField(null=True, blank=True)
    pincode = models.CharField(max_length=6,validators=[RegexValidator('^[0-9]{5}$', _('Invalid postal code'))],)

    def __str__(self):
        return self.name


class Equipment(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name + ' ' + self.location