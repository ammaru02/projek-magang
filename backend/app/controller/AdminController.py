import bcrypt
from flask import request, jsonify
from app.model.admin import Admin
from app import db, app
import random
import string
import logging
import jwt
import datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
mail = Mail(app)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = Admin.query.filter_by(id=data['id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

def get_admin_profile(current_user):
    if not current_user:
        return jsonify({'message': 'User not found!'}), 401
    
    admin_data = {
        'level': current_user.level,
        'name': current_user.name,
        'username': current_user.username,
        'email': current_user.email
    }
    return jsonify(admin_data)

# Fungsi login yang diperbarui
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "Username dan password harus diisi"}), 400

    admin = Admin.query.filter_by(username=username).first()

    if not admin or not check_password_hash(admin.password, password):
        return jsonify({"success": False, "message": "Username atau password salah"}), 401

    token = jwt.encode({
        'id': admin.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({"success": True, "token": token}), 200

def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'message': 'Email is required'}), 400

    # Generate token
    token = s.dumps(email, salt='email-confirm-salt')

    # Create reset URL
    reset_url = f'http://localhost:3000/reset-password/{token}'

    # Send email
    try:
        send_email(email, reset_url)
        return jsonify({'message': 'Password reset link has been sent to your email'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to send email'}), 500

def send_email(to, reset_url):
    msg = Message('Password Reset Request', sender='your_email@gmail.com', recipients=[to])
    msg.body = f'Your password reset link is {reset_url}. If you did not request a password reset, please ignore this email.'
    mail.send(msg)