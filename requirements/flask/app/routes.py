from flask import Blueprint, jsonify
import yfinance as yf

main_bp = Blueprint('main', __name__)

@main_bp.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@main_bp.route('/fonds/<ticker>', methods=['GET'])
def get_fund(ticker):
    fund = yf.Ticker(ticker)
    info = fund.info

    data = {
        'name': info.get('longName', 'N/A'),
        'description': info.get('longBusinessSummary', 'N/A'),
        'current_price': info.get('currentPrice', 'N/A'),
        'type': info.get('quoteType', 'N/A')
    }

    return jsonify(data)
