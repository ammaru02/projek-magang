from app import db


class Warga(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    wa = db.Column(db.BigInteger, nullable=False)
    
    def __repr__(self):
        return '<Warga {}>'.format(self.name)