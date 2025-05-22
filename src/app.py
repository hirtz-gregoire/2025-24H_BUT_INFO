from flask import Flask, render_template, redirect, url_for, request, flash, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
from src.utils import anonymous_required
from src.orm.models import db, User, Cart, Product
from src.data.seed_database import seed_database

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

login_manager.login_message = "Tu dois être connecté pour accéder à cette page."
login_manager.login_message_category = "warning"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    products = Product.query.all()
    return render_template('index.html', products=products)

@app.route('/api/product/<int:product_id>')
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'description': product.description or "Aucune description disponible"
    })

@app.route('/api/cart/add/<int:product_id>', methods=['POST'])
def add_to_cart(product_id):
    product = Product.query.get_or_404(product_id)
    
    if current_user.is_authenticated:
        # Utilisateur connecté - utiliser le panier de la base de données
        if not current_user.active_cart:
            # Créer un nouveau panier actif si l'utilisateur n'en a pas
            cart = Cart(user_id=current_user.id, is_active=True)
            db.session.add(cart)
            db.session.commit()
            current_user.active_cart_id = cart.id
            db.session.commit()
        else:
            cart = current_user.active_cart
        
        # Vérifier si le produit est déjà dans le panier
        if product not in cart.products:
            cart.products.append(product)
            db.session.commit()
            message = "Produit ajouté au panier"
        else:
            message = "Ce produit est déjà dans votre panier"
    else:
        # Utilisateur non connecté - utiliser le panier de session
        cart = session.get('cart', [])
        product_dict = {
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'description': product.description
        }
        
        # Vérifier si le produit est déjà dans le panier
        product_ids = [item['id'] for item in cart]
        if product.id not in product_ids:
            cart.append(product_dict)
            session['cart'] = cart
            message = "Produit ajouté au panier"
        else:
            message = "Ce produit est déjà dans votre panier"
    
    return jsonify({'success': True, 'message': message})

@app.route('/cart')
def view_cart():
    cart_items = []
    total = 0
    
    if current_user.is_authenticated and current_user.active_cart:
        # Utilisateur connecté avec un panier actif
        cart_items = current_user.active_cart.products
        total = sum(product.price for product in cart_items)
    else:
        # Utilisateur non connecté ou sans panier actif
        cart = session.get('cart', [])
        cart_items = cart
        total = sum(item['price'] for item in cart)
    
    return render_template('cart.html', cart_items=cart_items, total=total)

@app.route('/api/cart/remove/<int:product_id>', methods=['POST'])
def remove_from_cart(product_id):
    product = Product.query.get_or_404(product_id)
    
    if current_user.is_authenticated and current_user.active_cart:
        # Utilisateur connecté - utiliser le panier de la base de données
        cart = current_user.active_cart
        
        # Vérifier si le produit est dans le panier
        if product in cart.products:
            cart.products.remove(product)
            db.session.commit()
            message = "Produit retiré du panier"
        else:
            message = "Ce produit n'est pas dans votre panier"
    else:
        # Utilisateur non connecté - utiliser le panier de session
        cart = session.get('cart', [])
        
        # Trouver l'index du produit dans le panier
        product_index = next((i for i, item in enumerate(cart) if item['id'] == product_id), None)
        
        if product_index is not None:
            # Supprimer le produit du panier
            cart.pop(product_index)
            session['cart'] = cart
            message = "Produit retiré du panier"
        else:
            message = "Ce produit n'est pas dans votre panier"
    
    return jsonify({'success': True, 'message': message})

@app.route('/api/cart/count')
def get_cart_count():
    count = 0
    
    if current_user.is_authenticated and current_user.active_cart:
        # Utilisateur connecté avec un panier actif
        count = len(current_user.active_cart.products)
    else:
        # Utilisateur non connecté ou sans panier actif
        cart = session.get('cart', [])
        count = len(cart)
    
    return jsonify({'count': count})


with app.app_context():
    db.create_all()

from src.route.auth import auth_bp

app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
