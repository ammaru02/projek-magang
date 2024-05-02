from app import db
from app.model.desa import Desa
from app.model.warga import Warga
from app.model.kategori import Kategori

class Keunggulan(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    foto = db.Column(db.String(1000), nullable=False)
    deskripsi = db.Column(db.String(1000), nullable=False)
    desa_id = db.Column(db.BigInteger, db.ForeignKey('desa.id'))
    
    def __repr__(self):
        return '<Keunggulan {}>'.format(self.name)
    def serialize(self):
            return {
                'id': self.id,
                'foto': self.foto,
                'deskripsi': self.id,
            }