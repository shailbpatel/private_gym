# from django.contrib.auth.backends import ModelBackend
# from .models import User

# class NewBackend(ModelBackend):
#     def authenticate(self, request, username, password):
#         try:
#             user = User.objects.get(phone=username)
#             if user.check_password(password):
#                 return user
#             else:
#                 return None
#         except User.DoesNotExist:
#             return None

#     def get_user(self, phone):
#         try:
#             return User.objects.get(phone=phone)
#         except User.DoesNotExist:
#             return None