# Application de Gestion de Portefeuille

## Description

Cette application permet aux utilisateurs de gérer leurs portefeuilles financiers en ligne. Les fonctionnalités principales incluent l'inscription et la connexion des utilisateurs, la gestion des positions financières, et l'intégration avec l'API yFinance pour récupérer des données financières dynamiques. Les utilisateurs peuvent ajouter des fonds et des instruments financiers, et visualiser leurs positions dans un tableau de bord.

## Fonctionnalités

1. **Inscription des Utilisateurs**: Les nouveaux utilisateurs peuvent s'inscrire en fournissant une adresse email et un mot de passe.

2. **Connexion des Utilisateurs**: Les utilisateurs existants peuvent se connecter en utilisant leur adresse email et mot de passe.

3. **Gestion des Positions**: Les utilisateurs peuvent ajouter des positions financières à leurs portefeuilles, spécifiant les fonds, instruments, quantités, prix d'achat, et dates d'achat.

4. **Visualisation des Positions**: Les utilisateurs peuvent visualiser toutes leurs positions financières dans un tableau de bord avec des informations détaillées.

5. **Intégration avec yFinance**: L'application utilise l'API yFinance pour récupérer des données financières dynamiques pour les fonds et les instruments financiers.

## Endpoints Principaux

### Inscription

- **URL**: `/register`
- **Méthode**: `POST`
- **Description**: Inscription d'un nouvel utilisateur.

### Connexion

- **URL**: `/login`
- **Méthode**: `POST`
- **Description**: Connexion d'un utilisateur existant.

### Récupérer Tous les Fonds

- **URL**: `/api/get_all_funds`
- **Méthode**: `GET`
- **Description**: Récupère tous les fonds disponibles.

### Récupérer Tous les Instruments

- **URL**: `/api/get_all_instruments`
- **Méthode**: `GET`
- **Description**: Récupère tous les instruments financiers disponibles.

### Ajouter un Fonds

- **URL**: `/api/add_fund`
- **Méthode**: `POST`
- **Description**: Ajoute un nouveau fonds à la base de données en utilisant un ticker yFinance.

### Ajouter un Instrument

- **URL**: `/api/add_instrument`
- **Méthode**: `POST`
- **Description**: Ajoute un nouvel instrument financier à la base de données en utilisant un ticker yFinance.

### Récupérer les Positions

- **URL**: `/api/get_positions`
- **Méthode**: `GET`
- **Description**: Récupère toutes les positions financières d'un utilisateur spécifique.

## Technologies Utilisées

- **Flask**: Framework web pour Python.
- **MySQL**: Base de données relationnelle pour stocker les utilisateurs, fonds, instruments et positions.
- **yFinance**: Bibliothèque Python pour récupérer des données financières de Yahoo Finance.
- **Bootstrap**: Framework CSS pour un design réactif et moderne.

## Installation

1. Clonez le dépôt:
    ```sh
    git clone https://github.com/votre-utilisateur/votre-repo.git
    ```

2. Installez les dépendances:
    ```sh
    pip install -r requirements.txt
    ```

3. Configurez la base de données MySQL et mettez à jour les informations de connexion dans le fichier de configuration.

4. Démarrez l'application:
    ```sh
    flask run
    ```

## Auteur

- Votre Nom
- Contact: votre-email@example.com

