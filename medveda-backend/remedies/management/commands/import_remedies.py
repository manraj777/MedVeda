import sys
import csv
from django.core.management.base import BaseCommand
from remedies.models import Remedy, Category
from django.utils.text import slugify
from django.db import IntegrityError

csv.field_size_limit(10_000_000)  # Increase field size for large fields

class Command(BaseCommand):
    help = '🧹 Clears all remedies & categories, then imports fresh data from CSV, skipping duplicates.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--path',
            type=str,
            default='remedies/data/remedies_fixed_cleaned.csv',
            help='Path to the CSV file to import.',
        )

    def handle(self, *args, **options):
        path = options['path']

        # Step 1: Delete existing data
        self.stdout.write("🗑 Deleting all existing remedies and categories...")
        Remedy.objects.all().delete()
        Category.objects.all().delete()

        # Step 2: Import fresh data
        count = 0
        with open(path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                title = row.get('title', '').strip()
                if not title:
                    self.stdout.write(self.style.WARNING("⚠️ Skipping row with empty title"))
                    continue

                # Create or get category
                cat_name = row['category'].strip() or 'General Wellness'
                cat, _ = Category.objects.get_or_create(
                    name=cat_name,
                    defaults={'slug': slugify(cat_name)}
                )

                # Prepare Remedy fields
                try:
                    Remedy.objects.create(
                        title=title,
                        slug=slugify(title)[:200],
                        description=row.get('description', '').strip(),
                        ingredients=row.get('ingredients', '').strip(),
                        preparation=row.get('preparation', '').strip(),
                        health_benefits=row.get('health_benefits', '').strip(),
                        image=row.get('image_url', '').strip() or None,
                        rating=float(row.get('rating') or 0),
                        category=cat,
                    )
                    count += 1
                except IntegrityError:
                    self.stdout.write(self.style.WARNING(f"⚠️ Skipped duplicate slug for: {title}"))

        self.stdout.write(self.style.SUCCESS(f"✔️ Imported {count} remedies from CSV (duplicates skipped)."))
