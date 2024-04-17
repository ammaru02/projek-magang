from app import db
from app.model.visi import Visi

class Misi(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    misi = db.Column(db.String(250), nullable=False)
    visiId =db.Column(db.BigInteger, db.ForeignKey(Visi.id))
    
    def __repr__(self):
        return '<Misi {}>'.format(self.name)