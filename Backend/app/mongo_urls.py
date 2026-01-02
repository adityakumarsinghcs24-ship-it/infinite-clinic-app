from django.urls import path
from . import mongo_views, mongo_auth, health_views

urlpatterns = [
    # Health check endpoints
    path('health/', health_views.health_check, name='health-check'),
    path('warm-up/', health_views.warm_up, name='warm-up'),
    
    # Authentication endpoints (MongoDB)
    path('auth/register/', mongo_auth.register, name='mongo-register'),
    path('auth/login/', mongo_auth.login, name='mongo-login'),
    path('auth/logout/', mongo_auth.logout, name='mongo-logout'),
    path('auth/verify/', mongo_auth.verify_token, name='mongo-verify'),
    
    # Patient endpoints
    path('patients/', mongo_views.patient_list_create, name='patient-list-create'),
    path('patients/<str:patient_id>/', mongo_views.patient_detail, name='patient-detail'),
    
    # Consultation endpoints
    path('consultations/', mongo_views.consultation_list_create, name='consultation-list-create'),
    
    # Test endpoints
    path('tests/', mongo_views.test_list_create, name='test-list-create'),
    
    # Dashboard
    path('dashboard/stats/', mongo_views.dashboard_stats, name='dashboard-stats'),
    
    # Test Booking
    path('book-test/', mongo_views.book_test_with_patients, name='book-test'),
    
    # Time Slots (Similar to Patient API)
    path('time-slots/', mongo_views.time_slots_list_create, name='time-slots-list-create'),
    path('simple-time-slots/', mongo_views.simple_time_slots, name='simple-time-slots'),
    
    # Test API endpoint
    path('test/', mongo_views.test_api, name='test-api'),
    
    # Create default time slots (utility endpoint)
    path('create-time-slots/', mongo_views.create_time_slots_for_days, name='create-time-slots'),
]