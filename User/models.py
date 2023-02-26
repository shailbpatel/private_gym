from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, username=None, email=None, phone=None, password=None):
        """
        Creates and saves a User
        Allow creation with either username or email
        """
        if not any((email, phone)):
            raise ValueError('Users must have an email/phone')

        user = self.model()
        if email: user.email=self.normalize_email(email)
        if phone: user.phone=phone
        if username: user.username = username
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            '',
            email,
            password
        )
        user.is_admin = True
        user.save(using=self._db)
        return user
    

class User(AbstractBaseUser, PermissionsMixin):
    fname = models.CharField(max_length=100, blank=True, null=True, db_column='first_name')
    lname = models.CharField(max_length=100, blank=True, null=True, db_column='last_name')
    email = models.CharField(unique=True, max_length=100, blank=True, null=True)
    phone = models.CharField(unique=True, max_length=20, blank=True, null=True)
    is_staff = models.IntegerField(blank=True, null=True)
    creation_date = models.DateTimeField()
    updated_on = models.DateTimeField()

    USERNAME_FIELD = 'phone'

    objects = UserManager()

    class Meta:
        managed = False
        db_table = 'user'
        unique_together = (('phone'),)

    def get_full_name(self):
        # The user is identified by their email address
        return self.fname + ' ' + self.lname
    
    def get_short_name(self):
        # The user is identified by their email address
        return self.fname