from datetime import datetime

class Fund:
    def __init__(self, name, description, creation_date, assets_under_management):
        self.name = name
        self.description = description
        self.creation_date = creation_date
        self.assets_under_management = assets_under_management

        if creation_date is not None:
            self.creation_date = datetime.fromtimestamp(creation_date).date()
        else:
            self.creation_date = None
    
        if "ETF" in self.name:
            self.fund_type = "Exchange Traded Fund"
        elif "Bond" in self.name:
            self.fund_type = "Bond Fund"
        elif "Index" in self.name:
            self.fund_type = "Index Fund"
        else:
            self.fund_type = "Other"

    def __str__(self):
        return (f"Fund(Name: {self.name}, Description: {self.description}, "
                f"Creation Date: {self.creation_date}, Assets Under Management: {self.assets_under_management}, "
                f"Fund Type: {self.fund_type})")        

class Instrument:
    def __init__(self, type, ticker, nominal_value, issue_date, maturity_date, interest_rate, option_type, underlying_asset, sector, market_cap):
        self.type = type
        self.ticker = ticker
        self.nominal_value = nominal_value
        self.issue_date = issue_date
        self.maturity_date = maturity_date
        self.interest_rate = interest_rate
        self.option_type = option_type
        self.underlying_asset = underlying_asset
        self.sector = sector
        self.market_cap = market_cap

    def __str__(self):
        return (f"Instrument(Type: {self.type}, Ticker: {self.ticker}, Nominal Value: {self.nominal_value}, "
                f"Issue Date: {self.issue_date}, Maturity Date: {self.maturity_date}, "
                f"Interest Rate: {self.interest_rate}, Option Type: {self.option_type}, "
                f"Underlying Asset: {self.underlying_asset}, Sector: {self.sector}, "
                f"Market Cap: {self.market_cap})")
