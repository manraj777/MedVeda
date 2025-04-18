# remedies/management/commands/import_remedies.py

import sys
import csv
from django.core.management.base import BaseCommand
from remedies.models import Remedy, Category
from django.utils.text import slugify

# line to increase the maximum field size

csv.field_size_limit(10_000_000)  # ~10 MB per field

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

                # Category
                cat_name = row['category'].strip() or 'General Wellness'
                cat, _ = Category.objects.get_or_create(
                    name=cat_name,
                    defaults={'slug': slugify(cat_name)}
                )

                # Get or create Remedy
                obj, created = Remedy.objects.get_or_create(
                    title=title,
                    defaults={
                        'slug': slugify(title)[:200],
                        'description': row.get('description', '').strip(),
                        'ingredients': row.get('ingredients', '').strip(),
                        'preparation': row.get('preparation', '').strip(),
                        'health_benefits': row.get('health_benefits', '').strip(),
                        'image': row.get('image_url', '').strip() or None,
                        'rating': float(row.get('rating') or 0),
                        'category': cat,
                    }
                )

                if created:
                    count += 1

        self.stdout.write(self.style.SUCCESS(f"✔️ Imported {count} new remedies."))
