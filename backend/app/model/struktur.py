from app import db
from app.model.desa import Desa

class Struktur(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)    
    foto = db.Column(db.String(500), nullable=False)
    jabatan = db.Column(db.String(50), nullable=False)
    desaId = db.Column(db.BigInteger, db.ForeignKey(Desa.id))
    
    def __repr__(self):
        return '<Struktur {}>'.format(self.name)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'foto': self.foto,
            'jabatan': self.jabatan,
        }
