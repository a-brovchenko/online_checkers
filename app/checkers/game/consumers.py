import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class GameConsumer(WebsocketConsumer):
    def connect(self):

        self.board = self.scope['url_route']['kwargs']['board_id']
        self.board_group_name = 'board_%s' % self.board

        async_to_sync(self.channel_layer.group_add)(
            self.board_group_name, self.channel_name)
        self.accept()

    def receive(self, text_data):
        async_to_sync(self.channel_layer.group_send)(
            self.board_group_name,
            {
                'type': 'move',
                'message': text_data,
            }
        )

    def move(self, event):
        self.send(text_data=json.dumps({'move': event}))
