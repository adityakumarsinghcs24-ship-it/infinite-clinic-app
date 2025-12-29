
from pathlib import Path
from decouple import config
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-0npo4&-ne8grl#s8tfu3qz2nt=1ei$x3_uqzght7dth%!d&&x*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ["*"]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'



# Application definition
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",   # MUST BE FIRST
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "corsheaders",
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'base',
    "app",
    'consult_booking',
    'test_booking',
    "django_filters",
]

# Caching Configuration
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 300,  # 5 minutes
        'OPTIONS': {
            'MAX_ENTRIES': 1000,
        }
    }
}



CORS_ALLOWED_ORIGINS = []

CORS_ALLOW_ALL_ORIGINS = False  # For development only

CSRF_TRUSTED_ORIGINS = []


CORS_ALLOW_CREDENTIALS = True
AUTH_USER_MODEL = 'base.User'

SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True


ROOT_URLCONF = 'project.urls'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'base.authentication.CookiesJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),  # Increased from 10 minutes
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),  # Increased from 1 day
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,

    'AUTH_COOKIE': 'access_token',  # Cookie name for the access token
    'AUTH_COOKIE_REFRESH': 'refresh_token',  # Cookie name for the refresh token
    'AUTH_COOKIE_SECURE': True,  # Set to True if using HTTPS
    'AUTH_COOKIE_HTTP_ONLY': True,  # Make the cookie HTTP only
    'AUTH_COOKIE_PATH': '/',  # Root path for the cookie
    'AUTH_COOKIE_SAMESITE': 'None',  # Adjust according to your needs

}
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True



TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# Database - Minimal SQLite for Django admin only (optional)
# You can remove this completely if you don't need Django admin
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',  # In-memory database, no file created
    }
}

# MongoDB Configuration with MongoEngine
import mongoengine

MONGODB_SETTINGS = {
    'db': config('MONGO_DB_NAME', default='infinite_clinic_db'),
    'host': config('MONGO_URI', default='mongodb://localhost:27017'),
    'maxPoolSize': 50,  # Maximum number of connections
    'minPoolSize': 5,   # Minimum number of connections
    'maxIdleTimeMS': 30000,  # Close connections after 30 seconds of inactivity
    'serverSelectionTimeoutMS': 5000,  # 5 second timeout for server selection
    'socketTimeoutMS': 20000,  # 20 second socket timeout
    'connectTimeoutMS': 10000,  # 10 second connection timeout
}

# Connect to MongoDB with optimized settings
mongoengine.connect(
    db=MONGODB_SETTINGS['db'],
    host=MONGODB_SETTINGS['host'],
    maxPoolSize=MONGODB_SETTINGS['maxPoolSize'],
    minPoolSize=MONGODB_SETTINGS['minPoolSize'],
    maxIdleTimeMS=MONGODB_SETTINGS['maxIdleTimeMS'],
    serverSelectionTimeoutMS=MONGODB_SETTINGS['serverSelectionTimeoutMS'],
    socketTimeoutMS=MONGODB_SETTINGS['socketTimeoutMS'],
    connectTimeoutMS=MONGODB_SETTINGS['connectTimeoutMS'],
)


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Razorpay Settings
RAZORPAY_KEY_ID = config('RAZORPAY_KEY_ID', default='rzp_test_ROhm8gRpTv2xUm')
RAZORPAY_KEY_SECRET = config('RAZORPAY_KEY_SECRET', default='AOX9CU7x2sCR2Sp8XYv3lFoq')
