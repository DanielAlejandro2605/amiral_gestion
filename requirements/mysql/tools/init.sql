CREATE DATABASE IF NOT EXISTS amiral_gestion;

USE amiral_gestion;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS referentiel_fonds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    creation_date DATE,
    assets_under_management DECIMAL(20, 2),
    fund_type VARCHAR(50),
    UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS referentiel_instruments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50),
    ticker VARCHAR(10) UNIQUE,
    nominal_value DECIMAL(20, 2),
    issue_date DATE,
    sector VARCHAR(50),
    industry VARCHAR(50),
    market_cap DECIMAL(20, 2),
    dividend_yield DECIMAL(5, 2),
    currency VARCHAR(3),
    website VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    fund_id INT,
    instrument_id INT,
    quantity DECIMAL(20, 2),
    purchase_price DECIMAL(20, 2),
    purchase_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fund_id) REFERENCES referentiel_fonds(id),
    FOREIGN KEY (instrument_id) REFERENCES referentiel_instruments(id)
);

CREATE TABLE IF NOT EXISTS alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    fund_id INT,
    instrument_id INT,
    threshold DECIMAL(20, 2),
    alert_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fund_id) REFERENCES referentiel_fonds(id),
    FOREIGN KEY (instrument_id) REFERENCES referentiel_instruments(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (email, password) VALUES ('admin@admin.com', 'pass');
