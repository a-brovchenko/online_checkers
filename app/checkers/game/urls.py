from django.urls import path, include, re_path
from .views import *


urlpatterns = [
    path('', index),
    re_path(r'^board-(?P<board_name>\w+)/$', game, name='game'),
    path('table', new_board),
    path('accounts/', include('django.contrib.auth.urls')),
    path('list_board/', list_board),
    path('register/', registration),
    path('verification/', include('verify_email.urls')),
    path('activate/<str:uidb64>/<str:token>/', activate, name='activate'),
    path('user/<int:user_id>', profile, name='profile'),
    path('edit_profile/<int:user_id>', edit_profile, name='edit_profile'),
    path('player/', player),
    path('change/', change_move),
    path('end_game/', end_game),
    path('check/', check_player),
]
