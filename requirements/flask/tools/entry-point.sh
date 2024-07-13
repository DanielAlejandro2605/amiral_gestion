#!/bin/bash

# Function to test if MySQL is available
wait_for_mysql() {
    until mysqladmin ping -h${MYSQL_HOST} -u${MYSQL_USER} -p${MYSQL_PASSWORD} &> /dev/null; do
        >&2 echo "MySQL is unavailable - sleeping"
        sleep 3
    done
    >&2 echo "MySQL is up - executing Flask application"
}

# Waiting for MySQL
wait_for_mysql

# Start flask application
flask run --debug --host=0.0.0.0