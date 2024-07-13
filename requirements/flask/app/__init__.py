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
    app.config['MYSQL_DB'] = os.getenv('MYSQL_DATABASE')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
    app.config['MYSQL_PORT'] = os.getenv('MYSQL_PORT')
    app.config.setdefault("MYSQL_UNIX_SOCKET", None)
    app.config.setdefault("MYSQL_UNIX_SOCKET", None)
    app.config.setdefault("MYSQL_CONNECT_TIMEOUT", 10)
    app.config.setdefault("MYSQL_READ_DEFAULT_FILE", None)
    app.config.setdefault("MYSQL_USE_UNICODE", True)
    app.config.setdefault("MYSQL_CHARSET", "utf8")
    app.config.setdefault("MYSQL_SQL_MODE", None)
    app.config.setdefault("MYSQL_CURSORCLASS", None)
    app.config.setdefault("MYSQL_AUTOCOMMIT", False)
    app.config.setdefault("MYSQL_CUSTOM_OPTIONS", None)
    
    with app.app_context():
        # Import flask application blueprint (routes)
        from .routes import main_bp
        app.register_blueprint(main_bp)
        # Populate database
        from .populate_data import populate_data
        populate_data()

    return app

app = create_app()