# Simple checkers online
This is a simple checkers implementation using the daphne server.
There are two ways to move a piece: 
Simply sliding a piece diagonally forwards (also diagonally backwards in the case of kings) 
to an adjacent and unoccupied dark square, or "jumping" one of the opponent's pieces. 
In this case, one piece "jumps over" the other, there is a vacant square on the opposite side for it to land on.
A "man" can only jump diagonally forwards, but a "king" can also move diagonally backwards.
A piece that is jumped is captured and removed from the board.
The jump is mandatory, if the checker has already jumped and can jump again - you must do it.

To register users, you need to specify email in the project settings. Default settings for ukr.net
if you use gmail, make changes to settings.py
```
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'your email'
EMAIL_HOST_PASSWORD ='application password'
```

# Running a project via docker
To run a project in Docker, you need to create a file in the app/checkers/checkers/ directory.
### Running on Linux
Go to your project folder and enter the following commands in terminal
```commandline
SECRET_KEY=`openssl rand -base64 40`
```
```commandline
cat <<EOP > app/checkers/checkers/.env
SECRET_KEY='${SECRET_KEY}'
EMAIL_HOST_USER='your mail'
EMAIL_HOST_PASSWORD='your app pasword'
DB_HOST='db'
DB_NAME='checkers'
DB_USER='root'
DB_PASSWORD='password'
EOP
```
when executing commands, a .env file with variables is created.
Then run docker-compose
```commandline
docker-compose up -d
```

### Running on Windows
Go to your project folder and enter the following commands in terminal
```
$randomBytes = New-Object byte[] 40
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($randomBytes)
$secretKey = [Convert]::ToBase64String($randomBytes)
```
```commandline
@"
SECRET_KEY='$secretKey'
EMAIL_HOST_USER='your mail'
EMAIL_HOST_PASSWORD='your app pasword'
DB_HOST='db'
DB_NAME='checkers'
DB_USER='root'
DB_PASSWORD='password'
"@ | Set-Content -Path "app\checkers\checkers\.env"

```
Save the file
```commandline
Write-Host
```
When you first start the database, it will take time to start, so the docker python container will restart until the database starts

Аfter running docker, your application is available at 
```
http://localhost:8080/
```
Your database is available at 
```
http://localhost:8090/
```
