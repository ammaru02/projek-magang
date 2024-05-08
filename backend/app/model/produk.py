from app import db
from app.model.desa import Desa
from app.model.warga import Warga
from app.model.kategori import Kategori

class Produk(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    foto = db.Column(db.String(1000), nullable=False)
    harga = db.Column(db.Float, nullable=False)
    deskripsi = db.Column(db.String(1000), nullable=False)
    desa_id = db.Column(db.BigInteger, db.ForeignKey('desa.id'))
    warga_id = db.Column(db.BigInteger, db.ForeignKey('warga.id'))
    kategori_id = db.Column(db.BigInteger, db.ForeignKey('kategori.id'))
    
    def __repr__(self):
        return '<Produk {}>'.format(self.name)
def serialize(self):
    return {
        'id': self.id,
        'name': self.name,
        'foto': self.foto,
        'harga': self.harga,
        'deskripsi': self.deskripsi,
        'desa_id': self.desa_id,
        'warga_id': self.warga_id,
        'kategori_id': self.kategori_id
    }
