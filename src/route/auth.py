from flask import Blueprint, request, redirect, url_for, render_template, flash
from flask_login import login_required, current_user, login_user, logout_user
from src.utils import anonymous_required
from src.orm.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
@anonymous_required
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and check_password_hash(user.password, request.form['password']):
            login_user(user)  # ajouter remember=True si besoin de coockie longue durée
            return redirect(url_for('index'))
        flash("Nom d'utilisateur ou mot de passe incorrect.", "error")
    return render_template('login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
@anonymous_required
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if User.query.filter_by(username=username).first():
            flash("Ce nom d'utilisateur est déjà pris.", "error")
            return redirect(url_for('auth.register'))

        hashed_pw = generate_password_hash(password)
        new_user = User(username=username, password=hashed_pw)
        db.session.add(new_user)
        db.session.commit()
        flash("Compte créé avec succès. Connectez-vous.", "success")
        return redirect(url_for('index'))

    return render_template('register.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))
