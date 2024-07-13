from flask import Blueprint, render_template
from flask import jsonify
import yfinance as yf

bp = Blueprint('main', __name__)

@bp.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@bp.route('/fonds/<ticker>', methods=['GET'])
def get_fund(ticker):
    fund = yf.Ticker(ticker)
    info = fund.info

    data = {
        'name': info.get('longName', 'N/A'),
        'description': info.get('longBusinessSummary', 'N/A'),
        'current_price': info.get('currentPrice', 'N/A'),
        'quote_type': info.get('quoteType', 'N/A')
    }
    
    return jsonify(data)