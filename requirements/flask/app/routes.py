# Flask
from flask import Blueprint, jsonify, request
from flask_cors import CORS
# YahooFinance
import yfinance as yf
# MySQL to talk to database
from . import mysql
# For handling password
from werkzeug.security import generate_password_hash, check_password_hash
# Import User Model
from .models import User
# Import datatime
from datetime import datetime

main_bp = Blueprint('main', __name__)
CORS(main_bp)

@main_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    hashed_password = generate_password_hash(password)

    try:
        cursor = mysql.connection.cursor()
        
        # Check if the email already exists
        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'error': 'Email is already registered'}), 401
        
        # Insert the new user
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (%s, %s)",
            (email, hashed_password)
        )

        # Commit to the database and close the connection
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'User registered successfully'}), 201

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Database error'}), 500

@main_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('username')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT id, email, password FROM users WHERE email = %s",
            (email,)
        )

        user_tuple = cursor.fetchone()
        
        cursor.close()

        if user_tuple is None:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Creating User instance from tuple
        user = User.from_tuple(user_tuple)

        if user.password is not None and check_password_hash(user.password, password):
            return jsonify({'userId' : f'{user.id}', 'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Database error'}), 500
    
@main_bp.route('/api/get_all_funds', methods=['GET'])
def get_funds():
    try:
        cursor = mysql.connection.cursor()
        
        cursor.execute("SELECT * FROM referentiel_fonds")
        
        funds = cursor.fetchall()

        funds_list = []
        for fund in funds:
            fund_dict = {
                "id": fund[0],
                "name": fund[1],
                "description": fund[2],
                "creation_date": fund[3].strftime("%Y-%m-%d"),
                "assets_under_management": float(fund[4]),
                "fund_type": fund[5]
            }
            funds_list.append(fund_dict)

        return jsonify(funds_list)        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Database error'}), 500
    finally:
        cursor.close()


@main_bp.route('/api/get_all_instruments', methods=['GET'])
def get_instruments():
    try:
        cursor = mysql.connection.cursor()
        
        cursor.execute("SELECT * FROM referentiel_instruments")
        
        instruments = cursor.fetchall()

        instruments_list = []
        for instrument in instruments:
            instrument_dict = {
                "id": instrument[0],
                "type": instrument[1],
                "ticker": instrument[2],
                "nominal_value": float(instrument[3]),
                "issue_date": instrument[4].strftime("%Y-%m-%d") if instrument[4] else None,
                "sector": instrument[5],
                "industry": instrument[6],
                "market_cap": float(instrument[7]),
                "dividend_yield": float(instrument[8]),
                "currency": instrument[9],
                "website": instrument[10]
            }
            instruments_list.append(instrument_dict)

        return jsonify(instruments_list)        
    
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Database error'}), 500
    finally:
        cursor.close()


@main_bp.route('/api/get_funds_instruments', methods=['GET'])
def get_funds_instruments():
    try:
        cursor = mysql.connection.cursor()
    
        cursor.execute("SELECT id, name FROM referentiel_fonds")
        funds = cursor.fetchall()
        
        cursor.execute("SELECT id, ticker FROM referentiel_instruments")
        instruments = cursor.fetchall()

        return jsonify({
            'funds': [{'id': fund[0], 'name': fund[1]} for fund in funds],
            'instruments': [{'id': instrument[0], 'ticker': instrument[1]} for instrument in instruments]
            }), 200
    
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Database error'}), 500
    finally:
        cursor.close()


@main_bp.route('/api/create_position', methods=['POST'])
def post_create_position():
    data = request.json
    # Getting info from user
    user_id = data.get('user_id')
    fund_id = data.get('fund_id')
    instrument_id = data.get('instrument_id')
    position_quantity = data.get('position_quantity')
    purchase_price = data.get('purchase_price')
    # Getting data of transcation
    purchase_date = datetime.now().date()

    cursor = mysql.connection.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO positions (user_id, fund_id, instrument_id, quantity, purchase_price, purchase_date)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user_id, fund_id, instrument_id, position_quantity, purchase_price, purchase_date))

        mysql.connection.commit()
        
        return jsonify({'message': 'Position successfully created'}), 201

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Database error'}), 500
    finally:
        cursor.close()


@main_bp.route('/api/get_positions', methods=['GET'])
def get_positions():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    cursor = mysql.connection.cursor()

    try:
        # Get positions from user
        query_positions = """
            SELECT p.id, p.fund_id, p.instrument_id, p.quantity, p.purchase_price, p.purchase_date
            FROM positions p
            WHERE p.user_id = %s
        """
        cursor.execute(query_positions, (user_id,))
        positions = cursor.fetchall()

        if positions:
            # Getting the id's
            fund_ids = {position[1] for position in positions}
            instrument_ids = {position[2] for position in positions}

            fund_dict = {}
            instrument_dict = {}

            # Getting name of funds if there are any fund_ids
            if fund_ids:
                query_funds = "SELECT id, name FROM referentiel_fonds WHERE id IN (%s)" % ','.join(['%s'] * len(fund_ids))
                cursor.execute(query_funds, tuple(fund_ids))
                funds = cursor.fetchall()
                fund_dict = {fund[0]: fund[1] for fund in funds}

            # Getting the tickets from instruments if there are any instrument_ids
            if instrument_ids:
                query_instruments = "SELECT id, ticker FROM referentiel_instruments WHERE id IN (%s)" % ','.join(['%s'] * len(instrument_ids))
                cursor.execute(query_instruments, tuple(instrument_ids))
                instruments = cursor.fetchall()
                instrument_dict = {instrument[0]: instrument[1] for instrument in instruments}

            positions_list = []
            for position in positions:
                position_dict = {
                    "id": position[0],
                    "quantity": float(position[3]),
                    "purchase_price": float(position[4]),
                    "purchase_date": position[5].strftime("%Y-%m-%d"),
                    "fund_name": fund_dict.get(position[1]),
                    "instrument_ticker": instrument_dict.get(position[2])
                }
                positions_list.append(position_dict)
            return jsonify(positions_list), 200
        else:
            return jsonify([]), 200

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Database error'}), 500
    finally:
        cursor.close()
