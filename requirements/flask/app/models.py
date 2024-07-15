from datetime import datetime

class User:
    def __init__(self, id, email, password):
        self.id = id
        self.email = email
        self.password = password

    @classmethod
    def from_tuple(cls, user_tuple):
        if user_tuple:
            return cls(user_tuple[0], user_tuple[1], user_tuple[2])
        return None

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
    def __init__(self, type, ticker, nominal_value, issue_date, sector, industry, market_cap, dividend_yield, currency, website):
        self.type = type
        self.ticker = ticker
        self.nominal_value = nominal_value
        self.issue_date = issue_date
        self.sector = sector
        self.industry = industry
        self.market_cap = market_cap
        self.dividend_yield = dividend_yield
        self.currency = currency
        self.website = website

    def __str__(self):
        return (f"Instrument(Type: {self.type}, Ticker: {self.ticker}, Nominal Value: {self.nominal_value}, "
                f"Issue Date: {self.issue_date}, Sector: {self.sector}, Industry: {self.industry}, "
                f"Market Cap: {self.market_cap}, Dividend Yield: {self.dividend_yield}, "
                f"Currency: {self.currency}, Website: {self.website})")

