from app import db


class Visi(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    visi = db.Column(db.String(250), nullable=False)
    
    def __repr__(self):
        return '<Visi {}>'.format(self.name)