from app import db


class Desa(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    logo = db.Column(db.String(50), nullable=False)
    
    def __repr__(self):
        return '<Desa {}>'.format(self.name)