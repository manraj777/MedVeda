from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Create a new admin user'

    def handle(self, *args, **kwargs):
        username = input('Username: ')
        email = input('Email: ')
        password = input('Password: ')

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR("❌ User already exists."))
            return

        user = User.objects.create_user(username=username, email=email, password=password)
        
        user.is_staff = True
        user.is_superuser = True
        user.save()

        self.stdout.write(self.style.SUCCESS(f'✅ Admin user {username} created.'))
