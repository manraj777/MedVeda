from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import UserSignupSerializer, UserLoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout as django_logout
from remedies.serializers import RemedyListSerializer
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': user.username,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        return Response(serializer.validated_data)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def logout(request):
    django_logout(request)
    response = Response({"detail": "Logged out"})
    response.delete_cookie('access_token')
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_submissions(request):
    remedies = request.user.submitted_remedies.all()
    serializer = RemedyListSerializer(remedies, many=True)
    return Response(serializer.data)
