from django.db.models import Avg

def update_remedy_rating(remedy):
    reviews = remedy.reviews.all()
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
    remedy.rating = round(avg_rating, 2)
    remedy.save()

