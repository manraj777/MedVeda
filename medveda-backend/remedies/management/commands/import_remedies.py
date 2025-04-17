import csv
from django.core.management.base import BaseCommand
from remedies.models import Remedy, Category
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Import remedies from CSV'

    def add_arguments(self, parser):
        parser.add_argument(
            '--path',
            type=str,
            default='remedies/data/remedies_full_cleaned.csv',
            help='Path to the CSV file',
        )

    def handle(self, *args, **options):
        path = options['path']
        count = 0

        with open(path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                title = row.get('title', '').strip()
                if not title:
                    self.stdout.write(self.style.WARNING("⚠️ Skipping row with empty title"))
                    continue

                category_name = row.get('category', 'General').strip()
                category, _ = Category.objects.get_or_create(
                    name=category_name,
                    defaults={'slug': slugify(category_name)}
                )

                remedy, created = Remedy.objects.get_or_create(
                    title=title,
                    defaults={
                        'slug': slugify(title),
                        'description': row.get('description', '').strip(),
                        'ingredients': row.get('ingredients', '').strip(),
                        'preparation': row.get('preparation', '').strip(),
                        'health_benefits': row.get('health_benefits', '').strip(),
                        'image': row.get('image') or row.get('image_url', ''),
                        'rating': float(row.get('rating', 0) or 0),
                        'category': category,
                    }
                )

                if created:
                    count += 1

        self.stdout.write(self.style.SUCCESS(f"✔️ Successfully imported {count} remedies."))
