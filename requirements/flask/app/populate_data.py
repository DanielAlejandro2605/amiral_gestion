import yfinance as yf
from flask import current_app as app
from .models import Fund, Instrument
from . import mysql


def populate_data():
    funds = ['SPY', 'IVV', 'VOO', 'VTI', 'QQQ']
    # instruments = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'US10Y']

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

        cursor.execute("INSERT INTO referentiel_fonds (name, description, creation_date, assets_under_management, fund_type) VALUES (%s, %s, %s, %s, %s)",
                       (new_fund.name, new_fund.description, new_fund.creation_date, new_fund.assets_under_management, new_fund.fund_type))

        
    # Inserting instruments in database from yfinance
    # for instrument_ticker in instruments:
    #     instrument = yf.Ticker(instrument_ticker)
    #     info = instrument.info

    #     new_instrument = Instrument(
    #         type=info.get('quoteType', 'N/A'),
    #         ticker=instrument_ticker,
    #         nominal_value=info.get('previousClose', 0),
    #         issue_date=info.get('ipoDate', None),
    #         maturity_date=None,  # Asumí que no todos los instrumentos tienen fecha de vencimiento
    #         interest_rate=info.get('interestRate', 0),
    #         option_type=info.get('optionType', None),
    #         underlying_asset=info.get('underlying', None)
    #     )

    #     print(new_instrument)
    #     cursor.execute("INSERT INTO referentiel_instruments (type, ticker, nominal_value, issue_date, maturity_date, interest_rate, option_type, underlying_asset) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
    #                    (new_instrument.type, new_instrument.ticker, new_instrument.nominal_value, new_instrument.issue_date, new_instrument.maturity_date, new_instrument.interest_rate, new_instrument.option_type, new_instrument.underlying_asset))


    mysql.connection.commit()
    cursor.close()



        