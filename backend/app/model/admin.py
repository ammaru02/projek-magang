from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    level = db.Column(db.String(50), nullable=False)
    reset_token = db.Column(db.String(200), nullable=True)

    def set_password(self, newPassword):
        self.password = generate_password_hash(newPassword)


    def check_password(self, oldPassword):
        return check_password_hash(self.password, oldPassword)
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'level': self.level
        }
