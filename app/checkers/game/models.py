from django.contrib.auth.models import User
from django.db import models


class Board(models.Model):
    number_board = models.CharField(max_length=50, unique=True)
    player1 = models.IntegerField(default=0)
    player2 = models.IntegerField(default=0)
    winner = models.CharField(max_length=8)
    checkers = models.IntegerField(default=0)
    start_game = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.number_board


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)
    is_admin = models.BooleanField(default=False)

    def __str__(self):

        return self.user
