from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .mongo_models import User, JWTToken
import jwt
from datetime import datetime, timedelta
from django.conf import settings
import json

# JWT Settings
JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_LIFETIME = timedelta(hours=1)
REFRESH_TOKEN_LIFETIME = timedelta(days=7)

def create_jwt_token(user, token_type='access'):
    """Create JWT token for user"""
    if token_type == 'access':
        expires_at = datetime.utcnow() + ACCESS_TOKEN_LIFETIME
    else:
        expires_at = datetime.utcnow() + REFRESH_TOKEN_LIFETIME
    
    payload = {
        'user_id': str(user.id),
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'exp': expires_at,
        'iat': datetime.utcnow(),
        'type': token_type
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    # Store token in MongoDB
    jwt_token = JWTToken(
        user=user,
        token=token,
        token_type=token_type,
        expires_at=expires_at
    )
    jwt_token.save()
    
    return token

def verify_jwt_token(token):
    """Verify JWT token and return user"""
    try:
        # Check if token is blacklisted
        jwt_token = JWTToken.objects(token=token, is_blacklisted=False).first()
        if not jwt_token:
            return None
        
        # Decode token
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        # Get user
        user = User.objects(id=payload['user_id']).first()
        if not user or not user.is_active:
            return None
        
        return user
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register new user"""
    try:
        data = request.data
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        role = data.get('role', 'patient')
        
        # Validation
        if not username or not email or not password:
            return Response({'error': 'Username, email, and password are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if len(password) < 6:
            return Response({'error': 'Password must be at least 6 characters'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects(username=username).first():
            return Response({'error': 'Username already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects(email=email).first():
            return Response({'error': 'Email already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User(
            username=username,
            email=email,
            role=role
        )
        user.set_password(password)
        user.save()
        
        # Create tokens
        access_token = create_jwt_token(user, 'access')
        refresh_token = create_jwt_token(user, 'refresh')
        
        # Prepare response
        response = Response({
            'success': True,
            'message': 'User registered successfully',
            'user': {
                'id': str(user.id),
                'username': user.username.split('@')[0] if '@' in user.username else user.username,  # Extract username part
                'email': user.email,
                'role': user.role
            }
        }, status=status.HTTP_201_CREATED)
        
        # Set HTTP-only cookies
        response.set_cookie(
            'access_token',
            access_token,
            max_age=int(ACCESS_TOKEN_LIFETIME.total_seconds()),
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax'
        )
        
        response.set_cookie(
            'refresh_token',
            refresh_token,
            max_age=int(REFRESH_TOKEN_LIFETIME.total_seconds()),
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax'
        )
        
        return response
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user"""
    try:
        print(f"Login attempt - Request data: {request.data}")  # Debug log
        
        data = request.data
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        print(f"Login attempt - Username: {username}, Password length: {len(password)}")  # Debug log
        
        # Validation
        if not username or not password:
            print("Login failed - Missing username or password")  # Debug log
            return Response({'error': 'Username and password are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Find user (by username or email)
        user = User.objects(username=username).first()
        if not user:
            user = User.objects(email=username).first()
        
        print(f"User found: {user}")  # Debug log
        
        if not user:
            print("Login failed - User not found")  # Debug log
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        
        password_check = user.check_password(password)
        print(f"Password check result: {password_check}")  # Debug log
        
        if not password_check:
            print("Login failed - Invalid password")  # Debug log
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            print("Login failed - Account disabled")  # Debug log
            return Response({'error': 'Account is disabled'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        
        # Update last login
        user.last_login = datetime.utcnow()
        user.save()
        
        print("Login successful - Creating tokens")  # Debug log
        
        # Create tokens
        access_token = create_jwt_token(user, 'access')
        refresh_token = create_jwt_token(user, 'refresh')
        
        # Prepare response
        response = Response({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': str(user.id),
                'username': user.username.split('@')[0] if '@' in user.username else user.username,  # Extract username part
                'email': user.email,
                'role': user.role
            }
        }, status=status.HTTP_200_OK)
        
        # Set HTTP-only cookies
        response.set_cookie(
            'access_token',
            access_token,
            max_age=int(ACCESS_TOKEN_LIFETIME.total_seconds()),
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax'
        )
        
        response.set_cookie(
            'refresh_token',
            refresh_token,
            max_age=int(REFRESH_TOKEN_LIFETIME.total_seconds()),
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax'
        )
        
        print("Login successful - Response sent")  # Debug log
        return response
        
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    """Logout user"""
    try:
        # Get tokens from cookies
        access_token = request.COOKIES.get('access_token')
        refresh_token = request.COOKIES.get('refresh_token')
        
        # Blacklist tokens
        if access_token:
            jwt_token = JWTToken.objects(token=access_token).first()
            if jwt_token:
                jwt_token.is_blacklisted = True
                jwt_token.save()
        
        if refresh_token:
            jwt_token = JWTToken.objects(token=refresh_token).first()
            if jwt_token:
                jwt_token.is_blacklisted = True
                jwt_token.save()
        
        # Prepare response
        response = Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
        # Clear cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_token(request):
    """Verify if user is authenticated"""
    try:
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = verify_jwt_token(access_token)
        if not user:
            return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'authenticated': True,
            'user': {
                'id': str(user.id),
                'username': user.username.split('@')[0] if '@' in user.username else user.username,  # Extract username part
                'email': user.email,
                'role': user.role
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)