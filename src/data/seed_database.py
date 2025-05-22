import json
import os
from flask import Flask, current_app
from werkzeug.security import generate_password_hash
from pathlib import Path

from src.orm.models import db, User, Product, Cart


def seed_database(app=None):
    """Charge les données de test et les insère dans la base de données."""
    print("Chargement des données de test...")
    
    # Charger les données JSON
    data_path = Path(__file__).resolve().parent / 'test_data.json'
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Utiliser le contexte de l'application fournie ou créer un nouveau contexte
    if app is None:
        # Si aucune application n'est fournie, créer une nouvelle application Flask
        from flask import Flask
        app = Flask(__name__)
        
        # Utiliser le chemin de la base de données spécifié dans la variable d'environnement
        # ou utiliser le chemin par défaut
        import os
        db_uri = os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///database.db')
        app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
        
        # Initialiser la base de données avec l'application
        db.init_app(app)
    
    # Utiliser le contexte de l'application
    with app.app_context():
        print("Réinitialisation de la base de données...")
        db.drop_all()
        db.create_all()
        
        print("Insertion des utilisateurs...")
        users = {}
        for user_data in data['users']:
            user = User(
                username=user_data['username'],
                password=generate_password_hash(user_data['password'])
            )
            db.session.add(user)
            db.session.flush()  # Pour obtenir l'ID généré
            users[user.id] = user
        
        print("Insertion des produits...")
        products = {}
        for i, product_data in enumerate(data['products'], 1):
            product = Product(
                name=product_data['name'],
                price=product_data['price'],
                description=product_data.get('description', None)  # Utiliser None si la description n'est pas fournie
            )
            db.session.add(product)
            db.session.flush()
            products[i] = product
        
        print("Insertion des paniers...")
        carts = {}
        if 'carts' in data and data['carts']:
            for i, cart_data in enumerate(data['carts'], 1):
                cart = Cart(
                    user_id=cart_data['user_id'],
                    is_active=cart_data['is_active']
                )
                # Ajouter les produits au panier
                for product_id in cart_data['products']:
                    cart.products.append(products[product_id])
                
                db.session.add(cart)
                db.session.flush()
                carts[i] = cart
            
            # Mettre à jour les active_cart_id des utilisateurs
            for i, user_data in enumerate(data['users'], 1):
                if 'active_cart_id' in user_data and user_data['active_cart_id'] and user_data['active_cart_id'] in carts:
                    users[i].active_cart_id = carts[user_data['active_cart_id']].id
        else:
            print("Aucun panier à insérer.")
        
        # Valider toutes les modifications
        db.session.commit()
        print("Base de données initialisée avec succès!")

if __name__ == '__main__':
    # Importer l'application Flask depuis src.app
    from src.app import app
    seed_database(app)
