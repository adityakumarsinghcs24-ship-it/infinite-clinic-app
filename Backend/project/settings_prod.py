from .settings import *
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-production-secret-key-here')

# ALLOWED_HOSTS for production
ALLOWED_HOSTS = [
    'infinite-clinic-app.onrender.com',
    '.onrender.com',
]

# Add environment-based allowed hosts
env_allowed_hosts = os.environ.get('ALLOWED_HOSTS', '')
if env_allowed_hosts:
    ALLOWED_HOSTS.extend([host.strip() for host in env_allowed_hosts.split(',')])

# CORS settings for production
CORS_ALLOWED_ORIGINS = [
    "https://infinite-clinic-app.vercel.app",
]

# Add environment-based CORS origins
env_cors_origins = os.environ.get('CORS_ORIGINS', '')
if env_cors_origins:
    CORS_ALLOWED_ORIGINS.extend([origin.strip() for origin in env_cors_origins.split(',')])

CORS_ALLOW_ALL_ORIGINS = False  # Disable in production
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://infinite-clinic-app.vercel.app",
]

# Add environment-based CSRF trusted origins
if env_cors_origins:
    CSRF_TRUSTED_ORIGINS.extend([origin.strip() for origin in env_cors_origins.split(',')])

# Security settings for production
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SESSION_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SAMESITE = "None"

# HTTPS settings (enable when you have SSL certificate)
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True

# Static files for production
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# MongoDB settings for production
MONGODB_SETTINGS = {
    'db': os.environ.get('MONGO_DB_NAME', 'infinite_clinic_prod'),
    'host': os.environ.get('MONGO_URI', 'mongodb://localhost:27017'),
    'maxPoolSize': 50,
    'minPoolSize': 5,
    'maxIdleTimeMS': 30000,
    'serverSelectionTimeoutMS': 5000,
    'socketTimeoutMS': 20000,
    'connectTimeoutMS': 10000,
}

# Time Slots Configuration
ENABLE_TIME_SLOTS_AUTO_CREATION = os.environ.get('ENABLE_TIME_SLOTS_AUTO_CREATION', 'True').lower() == 'true'

# Logging for production
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": True,
        },
        "app": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": True,
        },
    },
}
