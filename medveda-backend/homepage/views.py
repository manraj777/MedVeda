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
def testimonial_list(request):
    testimonials = Testimonial.objects.all().order_by('-created_at')[:2]  # optional limit
    serializer = TestimonialSerializer(testimonials, many=True)
    return Response(serializer.data)

