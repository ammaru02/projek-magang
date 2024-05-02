from app import db
from app.model.desa import Desa

class Artikel(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    judul = db.Column(db.String(500), nullable=False)    
    tanggal = db.Column(db.Date, nullable=False)
    foto = db.Column(db.String(500), nullable=False)
    deskripsi = db.Column(db.String(10000), nullable=False)
    desaId =db.Column(db.BigInteger, db.ForeignKey(Desa.id))
    
    def __repr__(self):
        return '<Artikel {}>'.format(self.name)