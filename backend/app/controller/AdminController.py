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
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
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
    
    # Logging the received email
    logger.info(f"Received forgot password request for email: {email}")
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400

    admin = Admin.query.filter_by(email=email).first()
    if not admin:
        return jsonify({'message': 'Admin with this email does not exist'}), 404

    try:
        # Generate token (OTP)
        token = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        logger.info(f"Generated token for email: {email}")

        # Save token to the database
        admin.reset_token = token
        db.session.commit()

        # Send token via email
        send_token_email(email, token)
        logger.info(f"Token sent to email: {email}")
        
        return jsonify({'message': 'Token has been sent to your email'}), 200
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}", exc_info=True)
        return jsonify({'message': 'Failed to send email'}), 500

def send_token_email(to, token):
    try:
        msg = Message('Password Reset Token', sender=app.config['MAIL_USERNAME'], recipients=[to])
        msg.body = f'Your password reset token is: {token}.'
        mail.send(msg)
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}", exc_info=True)
        raise

def reset_password():
    data = request.get_json()
    email = data.get('email')
    token = data.get('token')
    new_password = data.get('new_password')

    # Log data received
    logger.info(f"Received reset password request for email: {email}, token: {token}")

    if not email:
        logger.error('Email is required')
        return jsonify({'message': 'Email is required'}), 400

    if not token:
        logger.error('Token is required')
        return jsonify({'message': 'Token is required'}), 400

    if not new_password:
        logger.error('New password is required')
        return jsonify({'message': 'New password is required'}), 400

    admin = Admin.query.filter_by(email=email).first()
    if not admin:
        logger.error(f'Admin with email {email} does not exist')
        return jsonify({'message': 'Admin with this email does not exist'}), 404

    # Verify token
    if token != admin.reset_token:
        logger.error(f'Invalid token for email {email}')
        return jsonify({'message': 'Invalid token'}), 401

    try:
        # Update password
        admin.password = generate_password_hash(new_password)
        admin.reset_token = None
        db.session.commit()
        logger.info(f"Password reset successfully for email: {email}")
        return jsonify({'message': 'Password reset successfully'}), 200
    except Exception as e:
        logger.error(f"Failed to reset password: {str(e)}", exc_info=True)
        return jsonify({'message': 'Failed to reset password'}), 500

def generate_token():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    try:
        # Generate token (OTP)
        token = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        logger.info(f"Generated token for email: {email}")

        # Kirim token via email
        subject = 'Password Reset Token'
        body = f'Your password reset token is: {token}.'
        send_email(email, subject, body)
        logger.info(f"Token sent to email: {email}")

        return jsonify({'message': 'Token has been sent to your email'}), 200
    except Exception as e:
        logger.error(f"Failed to send token: {str(e)}", exc_info=True)
        return jsonify({'message': 'Failed to send token'}), 500

def send_email(to, subject, body):
    try:
        msg = Message(subject, sender=app.config['MAIL_USERNAME'], recipients=[to])
        msg.body = body
        mail.send(msg)
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}", exc_info=True)
        raise

def change_password(current_user):
    data = request.get_json()
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if not old_password or not new_password:
        return jsonify({'message': 'Old Password and New Password fields cannot be empty'}), 400

    if not check_password_hash(current_user.password, old_password):
        return jsonify({'message': 'Old password is incorrect'}), 401

    current_user.password = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({'message': 'Password updated successfully'}), 200

def create():
    data = request.get_json()
        
    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    level = data.get('level')

    if not name or not username or not email or not password or not level:
        return jsonify({'message': 'All fields are required'}), 400
        
    if Admin.query.filter_by(email=email).first() or Admin.query.filter_by(username=username).first():
        return jsonify({'message': 'User with this email or username already exists'}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
    new_admin = Admin(
        name=name,
        username=username,
        email=email,
        password=hashed_password,
        level=level
    )

    try:
        db.session.add(new_admin)
        db.session.commit()
        logger.info(f"Admin created: {new_admin.serialize()}")
        return jsonify({'message': 'Admin created successfully'}), 201
    except Exception as e:
        logger.error(f"Error creating admin: {str(e)}", exc_info=True)
        return jsonify({'message': 'Error creating admin'}), 500