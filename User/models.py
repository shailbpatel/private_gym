from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.utils import timezone

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, fname=None, lname=None, email=None, phone=None, password=None):
        """
        Creates and saves a User
        Allow creation with either username or email
        """
        if not any((email, phone)):
            raise ValueError('Users must have an email/phone')

        user = self.model()
        if email: user.email=self.normalize_email(email)
        if phone: user.phone=phone
        if fname: user.fname = fname
        if lname: user.lname = lname
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, fname='', lname='', email='', phone='', password=None):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            fname=fname,
            lname=lname,
            email=email,
            phone=phone,
            password=password,
        )
        user.role = User.ADMIN
        user.save(using=self._db)
        return user
   

class User(AbstractBaseUser, PermissionsMixin):
    ADMIN = 0
    MEMBER = 1
    NON_MEMBER = 2
    ROLE_CHOICES = (
        (ADMIN, 'Admin'),
        (MEMBER, 'Member'),
        (NON_MEMBER, 'Non-member'),
    )
    fname = models.CharField(max_length=100, blank=True, null=True, db_column='first_name')
    lname = models.CharField(max_length=100, blank=True, null=True, db_column='last_name')
    email = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(unique=True, max_length=20)
    role = models.IntegerField(default=NON_MEMBER, choices=ROLE_CHOICES)
    expiry_date = models.DateTimeField(blank=True, null=True)
    creation_date = models.DateTimeField(default=timezone.now)
    updated_on = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'phone'

    objects = UserManager()

    class Meta:
        db_table = 'user'
        unique_together = (('phone'),)

    def has_module_perms(self, app_label):
       return self.role == User.ADMIN
    
    def has_perm(self, perm, obj=None):
       return self.role == User.ADMIN

    @property
    def is_staff(self):
        if self.role == User.ADMIN:
            return True
        return False

    def get_full_name(self):
        # The user is identified by their email address
        name = ''
        if self.fname:
            name += self.fname
        if self.lname:
            name += ' ' +  self.lname
        return name
    
    def get_short_name(self):
        # The user is identified by their email address
        return self.fname
    
    def __str__(self):
        return self.get_full_name()
    

class Enrolled(models.Model):
    user = models.ForeignKey('User.User', on_delete=models.CASCADE)
    enrolled_class = models.ForeignKey('Business.Class', on_delete=models.CASCADE)