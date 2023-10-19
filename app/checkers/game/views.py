from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.shortcuts import render, redirect, HttpResponse
import secrets
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from online_users.models import OnlineUserActivity
from .models import *
from .forms import RegistrationForm
from .token import account_activation_token
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from datetime import timedelta
import logging


def index(request):
    online_users = OnlineUserActivity.get_user_activities(timedelta(minutes=60))
    return render(request, 'game/base.html', {'online_users': online_users})


def game(request, board_name):
    board = Board.objects.get(number_board=board_name)

    if board.player1 != 0 and board.player2 != 0:
        return render(request, 'game/base.html')

    elif board.player1 == request.user.id:
        return render(request, 'game/game.html', {'board_name': board_name})

    else:
        board.player2 = request.user.id
        board.save()
        return render(request, 'game/game.html', {'board_name': board_name})


def new_board(request):
    name = secrets.token_hex(4)
    new_game = Board(number_board=name, player1=request.user.id)
    new_game.save()

    redirect_url = f'board-{name}/'
    return redirect(redirect_url)


def list_board(request):
    boards = Board.objects.filter(player2=0)
    logging.info(f'board - {boards}')
    return render(request, 'game/list_board.html', {'boards': boards})


def registration(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()

            current_site = get_current_site(request)
            mail_subject = 'Activation link has been sent to your email id'
            message = render_to_string('registration/registration_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            })
            to_email = form.cleaned_data.get('email')
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )
            email.send()

        return HttpResponse('Please confirm your email address to complete the registration')

    else:
        form = RegistrationForm()
        return render(request, 'registration/register.html', {'form': form})


def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        print(user)
        print(user == 'admin')
        if str(user) == 'admin':
            UserProfile.objects.create(user=user, is_admin=True)
        else:
            UserProfile.objects.create(user=user)
        user.save()
        return redirect('/')
    else:
        return HttpResponse('Activation link is invalid!')


def profile(request, user_id):
    user = User.objects.get(pk=user_id)
    admin = UserProfile.objects.get(user_id=request.user.id)
    return render(request, 'game/profile.html', {'user': user, 'admin': admin})


def edit_profile(request, user_id):
    user = User.objects.get(pk=user_id)

    if request.method == 'POST':

        user.first_name = request.POST['first_name']
        user.last_name = request.POST['last_name']
        user.save()
        return redirect('profile', user_id=user.id)

    return render(request, 'game/edit_profile.html', {'user': user})


def player(request):
    if request.method == 'POST':
        user_id = int(request.POST.get('user_id'))
        board = request.POST.get('board')
        board = Board.objects.get(number_board=board)

        if board.player1 == user_id:
            return JsonResponse({'player1': True})
        else:
            return JsonResponse({'player1': False})


def change_move(request):
    if request.method == 'POST':
        turn = request.POST.get('turn')
        player = request.POST.get('player')
        logging.info(f'player - {player}')
        logging.info(f'turn - {turn}')
        if turn == 'false':
            turn = False
        else:
            turn = True
    return JsonResponse({'turn': turn, 'player': player})

def end_game(request):
    if request.method == 'POST':
        player = request.POST.get('player')
        score = request.POST.get('score')
        board = request.POST.get('board')
        board = Board.objects.get(number_board=board)
        if player == 'player1':
            player = board.player1
        else:
            player = board.player2
        board.winner = player
        board.checkers = int(score)
        board.save()

        p1 = UserProfile.objects.get(user_id=board.player1)
        p2 = UserProfile.objects.get(user_id=board.player2)
        logging.info(f'p1-{p1.user_id} {type(p1.user_id)}, {board.winner}, {type(board.winner)}')
        if p1.user_id == board.winner:
            p1.games_won += 1
        else:
            p2.games_won += 1
        p1.games_played += 1
        p2.games_played += 1
        p1.save()
        p2.save()
        return JsonResponse({'1' : 1})
