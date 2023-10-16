from django.urls import re_path, path
from game.consumers import GameConsumer

websocket_urlpatterns=[
    re_path(r'^board-(?P<board_id>\w+)/$', GameConsumer.as_asgi()),

]