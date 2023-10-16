
import os
from pathlib import Path
from dotenv import dotenv_values

# place .env file into the same directory
# https://pypi.org/project/python-dotenv/
dotenv_variables = {
    **dotenv_values()
}

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = dotenv_variables['SECRET_KEY']

DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'game',
    'verify_email.apps.VerifyEmailConfig',
    'online_users',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # 'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'online_users.middleware.OnlineNowMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',

]


ROOT_URLCONF = 'checkers.urls'

ТЕМРLАТЕ_DIR = os.path.join(BASE_DIR, "templates")

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [ТЕМРLАТЕ_DIR, ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


LOGIN_REDIRECT_URL = '/'
WSGI_APPLICATION = 'checkers.wsgi.application'
ASGI_APPLICATION = 'game.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',  # Изменился BACKEND
    },
}


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': dotenv_variables['DB_NAME'],
        'USER': dotenv_variables['DB_USER'],
        'PASSWORD': dotenv_variables['DB_PASSWORD'],
        'HOST': dotenv_variables['DB_HOST'],
        'PORT': '3306',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/


STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

DEFAULT_FROM_EMAIL = 'testdjangocheckers@ukr.net'
EMAIL_HOST = "smtp.ukr.net"
EMAIL_PORT = 2525
EMAIL_HOST_USER = dotenv_variables['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = dotenv_variables['EMAIL_HOST_PASSWORD']
EMAIL_USE_TLS = False
EMAIL_USE_SSL = True