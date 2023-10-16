from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('', include('game.urls')),
    path('admin/', admin.site.urls),

]
