from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Simple health check endpoint to keep the server warm
    """
    return JsonResponse({
        'status': 'healthy',
        'message': 'Server is running'
    })

@csrf_exempt
@require_http_methods(["GET"])
def warm_up(request):
    """
    Warm up endpoint to initialize connections
    """
    try:
        # Test MongoDB connection
        from .mongo_models import User
        User.objects.count()  # Simple query to warm up connection
        
        return JsonResponse({
            'status': 'warmed_up',
            'message': 'Server connections initialized'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)