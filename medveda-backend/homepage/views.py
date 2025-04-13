from django.shortcuts import render
from django import Response
from .models import Testimonial
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    TestimonialSerializer,
)



@api_view(['GET'])
def homepage_view(request):
    testimonials = Testimonial.objects.all().order_by('-created_at')[:6]
    # how_it_works = HowItWorksStep.objects.all().order_by('order')
    # static_sections = StaticSection.objects.all()

    return Response({
        
        "testimonials": TestimonialSerializer(testimonials, many=True).data,
        # "categories": ... future
        # "trending_remedies": ... future
    })

