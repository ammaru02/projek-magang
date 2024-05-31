from flask import request, jsonify
from app.model.admin import Admin
from app import app, db
from werkzeug.security import generate_password_hash, check_password_hash
import random
import string
import logging
import jwt
import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def index():
    try:
        admins = Admin.query.all()
        admin_list = [admin.serialize() for admin in admins]
        return jsonify(admin_list), 200
    except Exception as e:
        logger.error(f"Error fetching admins: {str(e)}")
        return jsonify({'message': 'Error fetching admins'}), 500
    
def get_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    token = token.split(" ")[1]  # Menghapus bagian 'Bearer'
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        admin_id = data['admin_id']
        admin = Admin.query.get(admin_id)  # Pastikan Anda memiliki model Admin yang sesuai
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        admin_data = {
            'level': admin.level,
            'name': admin.name,
            'username': admin.username,
            'email': admin.email
        }
        return jsonify(admin_data)
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    
def get(id):
    try:
        admin = Admin.query.get_or_404(id)
        return jsonify(admin.serialize()), 200
    except Exception as e:
        logger.error(f"Error fetching admin with id {id}: {str(e)}")
        return jsonify({'message': 'Admin not found'}), 404

def create():
    try:
        data = request.json

        # Required fields validation
        if not data or not all(k in data for k in ("name", "username", "email", "password", "level")):
            logger.error('Missing required fields')
            return jsonify({'error': 'Missing required fields'}), 400

        # Hash the password
        hashed_password = generate_password_hash(data['password'])

        new_admin = Admin(
            name=data['name'],
            username=data['username'],
            email=data['email'],
            password=hashed_password,
            level=data['level']
        )

        db.session.add(new_admin)
        db.session.commit()

        return jsonify(new_admin.serialize()), 201
    except Exception as e:
        logger.error(f"Error creating admin: {str(e)}")
        return jsonify({'error': 'Error creating admin'}), 500

def update_password(id):
    try:
        admin = Admin.query.get_or_404(id)
        data = request.json

        logger.info(f"Received data: {data}")

        if not data or 'oldPassword' not in data or 'newPassword' not in data:
            logger.error('Both oldPassword and newPassword are required')
            return jsonify({'error': 'Both oldPassword and newPassword are required'}), 400

        old_password = data['oldPassword']
        new_password = data['newPassword']

        logger.info(f"Old password provided: {old_password}")
        logger.info(f"Hashed password in database: {admin.password}")

        password_check = admin.check_password(old_password)
        logger.info(f"Password check result: {password_check}")

        if not password_check:
            logger.error('Incorrect old password')
            return jsonify({'error': 'Incorrect old password'}), 400

        admin.set_password(new_password)
        db.session.commit()

        return jsonify({
            'id': admin.id,
            'message': 'Password updated successfully'
        }), 200
    except Exception as e:
        logger.error(f"Error updating password for admin with id {id}: {str(e)}")
        return jsonify({'error': 'Error updating password'}), 500

def reset_password():
    try:
        data = request.json
        token = data.get('token')
        new_password = data.get('new_password')

        if not token or not new_password:
            return jsonify({'error': 'Token and new password are required'}), 400

        admin = Admin.query.filter_by(reset_token=token).first()
        if not admin:
            return jsonify({'error': 'Invalid token'}), 400

        admin.set_password(new_password)
        admin.reset_token = None
        db.session.commit()

        return jsonify({'message': 'Password has been reset successfully'}), 200
    except Exception as e:
        logger.error(f"Error resetting password: {str(e)}")
        return jsonify({'error': 'Error resetting password'}), 500

def request_password_reset():
    try:
        data = request.json
        email = data.get('email')
        admin = Admin.query.filter_by(email=email).first()

        if not admin:
            return jsonify({'message': 'User not found'}), 404

        token = ''.join(random.choices(string.ascii_letters + string.digits, k=50))
        admin.reset_token = token
        db.session.commit()

        # Placeholder for sending email with reset token
        logger.info(f"Password reset token for {email}: {token}")

        return jsonify({'reset_token': token}), 200
    except Exception as e:
        logger.error(f"Error requesting password reset for email {email}: {str(e)}")
        return jsonify({'error': 'Error requesting password reset'}), 500

def login():
    try:
        auth_data = request.get_json()
        print(f"Auth data received: {auth_data}")  # Tambahkan log ini
        username = auth_data.get('username')
        password = auth_data.get('password')

        admin = Admin.query.filter_by(username=username).first()
        if admin:
            print(f"Admin found: {admin}")  # Tambahkan log ini
        else:
            print("Admin not found")  # Tambahkan log ini

        if admin and check_password_hash(admin.password, password):  # Verifikasi password
            token = jwt.encode({
                'admin_id': admin.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }, app.config['SECRET_KEY'], algorithm="HS256")
            return jsonify({"success": True, "token": token})

        return jsonify({"success": False, "message": "Invalid username or password"}), 401
    except Exception as e:
        print(f"Error during login: {e}")  # Tambahkan log ini
        return jsonify({"success": False, "message": "Internal Server Error"}), 500