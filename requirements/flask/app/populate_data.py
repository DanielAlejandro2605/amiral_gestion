import yfinance as yf
from flask import current_app as app
from .models import Fund, Instrument
from . import mysql
import MySQLdb

def populate_data():
    funds = ['SPY', 'IVV', 'VOO', 'VTI', 'QQQ']
    instruments = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']

    # Connection to database
    cursor = mysql.connection.cursor()

    # Inserting funds in database from yfinance
    for fund_ticker in funds:
        fund = yf.Ticker(fund_ticker)
        info = fund.info

        new_fund = Fund(
            name=info.get('longName', 'N/A'),
            description=info.get('longBusinessSummary', 'N/A'),
            creation_date=info.get('fundInceptionDate', None),
            assets_under_management=info.get('totalAssets', 0)
        )

        # Inserting new_fund into database
        try:
            cursor.execute("INSERT INTO referentiel_fonds (name, description, creation_date, assets_under_management, fund_type) VALUES (%s, %s, %s, %s, %s)",
                        (new_fund.name, new_fund.description, new_fund.creation_date, new_fund.assets_under_management, new_fund.fund_type))
        except MySQLdb.IntegrityError as err:
            print("Error: {}".format(err))

    # Inserting instruments in database from yfinance
    for instrument_ticker in instruments:
        instrument = yf.Ticker(instrument_ticker)
        info = instrument.info

        new_instrument = Instrument(
            type=info.get('quoteType', 'N/A'),
            ticker=instrument_ticker,
            nominal_value=info.get('previousClose', 0),
            issue_date=info.get('ipoDate', None),
            sector=info.get('sector', 'N/A'),
            industry=info.get('industry', 'N/A'),
            market_cap=info.get('marketCap', 0),
            dividend_yield=info.get('dividendYield', 0),
            currency=info.get('currency', 'N/A'),
            website=info.get('website', 'N/A')
        )

        try:
            cursor.execute("INSERT INTO referentiel_instruments (type, ticker, nominal_value, issue_date, sector, industry, market_cap, dividend_yield, currency, website) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (new_instrument.type, new_instrument.ticker, new_instrument.nominal_value, new_instrument.issue_date, new_instrument.sector, new_instrument.industry, new_instrument.market_cap, new_instrument.dividend_yield, new_instrument.currency, new_instrument.website))
        except MySQLdb.IntegrityError as err:
            print("Error: {}".format(err))

    mysql.connection.commit()
    cursor.close()