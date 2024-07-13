import os
from flask import Flask
from flask_mysqldb import MySQL
from dotenv import load_dotenv

load_dotenv()

mysql = MySQL()

def create_app():
    app = Flask(__name__)
    
    #app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    
    app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
    app.config['MYSQL_DATABASE'] = os.getenv('MYSQL_DATABASE')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')

    from .main import bp as main_bp
    app.register_blueprint(main_bp)

    return app

app = create_app()