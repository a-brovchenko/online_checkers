FROM python:3.10.12-alpine3.18

WORKDIR /app

RUN \
    apk update && \
    apk add --virtual build-deps gcc python3-dev musl-dev && \
    apk add --no-cache mariadb-dev

COPY app/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN apk del build-deps

COPY app/ ./

WORKDIR /app/checkers

EXPOSE 8080

ENTRYPOINT \
    python manage.py makemigrations && \
    python manage.py migrate && \
    daphne -b 0.0.0.0 -p 8080 checkers.asgi:application