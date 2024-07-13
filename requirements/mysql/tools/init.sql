CREATE DATABASE IF NOT EXISTS amiral_gestion;

USE amiral_gestion;

CREATE TABLE IF NOT EXISTS referentiel_fonds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    creation_date DATE,
    assets_under_management DECIMAL(20, 2),
    fund_type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS referentiel_instruments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50),
    ticker VARCHAR(10),
    nominal_value DECIMAL(20, 2),
    issue_date DATE,
    maturity_date DATE,
    interest_rate DECIMAL(5, 2),
    option_type VARCHAR(10),
    underlying_asset VARCHAR(255),
    sector VARCHAR(50),
    market_cap DECIMAL(20, 2)
);

CREATE TABLE IF NOT EXISTS positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fund_id INT,
    instrument_id INT,
    quantity DECIMAL(20, 2),
    market_value DECIMAL(20, 2),
    purchase_price DECIMAL(20, 2),
    purchase_date DATE,
    FOREIGN KEY (fund_id) REFERENCES referentiel_fonds(id),
    FOREIGN KEY (instrument_id) REFERENCES referentiel_instruments(id)
);
