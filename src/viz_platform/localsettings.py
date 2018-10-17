from .settings import * #@UnusedWildImport

DEBUG = True

DATABASES = {
   'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'viz_db',
        'USER': 'deploy',
        'PASSWORD': 'mghmit1',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}