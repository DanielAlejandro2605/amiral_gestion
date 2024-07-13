FROM python:3.10.8-slim-bullseye

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    default-mysql-client \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY ./tools/entry-point.sh /usr/local/bin/entry-point.sh
RUN chmod +x /usr/local/bin/entry-point.sh

COPY ./app /app

ENV FLASK_APP=app
ENV FLASK_ENV=development

EXPOSE 5000

ENTRYPOINT ["entry-point.sh"]
