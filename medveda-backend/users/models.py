from django.contrib.auth.models import AbstractUser
from django.db import models

#extending existing django user model
class User(AbstractUser):
    # Extend if needed later (e.g., avatar, bio)
    pass
