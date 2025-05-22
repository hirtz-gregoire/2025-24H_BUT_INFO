from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

cart_product = db.Table('cart_product',
    db.Column('cart_id', db.Integer, db.ForeignKey('cart.id'), primary_key=True),
    db.Column('product_id', db.Integer, db.ForeignKey('product.id'), primary_key=True)
)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    carts = db.relationship('Cart', backref='owner', lazy=True, foreign_keys='Cart.user_id')

    # Champ facultatif pour lier le panier actif
    active_cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'))
    active_cart = db.relationship('Cart', foreign_keys=[active_cart_id], post_update=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(500), nullable=True)

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=False)
    products = db.relationship('Product', secondary=cart_product, lazy='subquery', backref=db.backref('carts', lazy=True))
