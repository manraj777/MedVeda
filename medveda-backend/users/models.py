from django.contrib.auth.models import AbstractUser
from django.db import models

#extending existing django user model
class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    def __str__(self):
        return self.username
