from app import db


class Admin(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), unique=True ,nullable=False)
    email = db.Column(db.String(60),index=True, unique=True, nullable=False)
    password = db.Column(db.String(25), nullable=False)
    level = db.Column(db.String(50), unique=True ,nullable=False)

    def __repr__(self):
        return '<Admin {}>'.format(self.name)