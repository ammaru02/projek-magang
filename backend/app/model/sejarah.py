from app import db
from app.model.desa import Desa

class Sejarah(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)    
    foto = db.Column(db.String(500), nullable=False)
    deskripsi = db.Column(db.String(10000), nullable=False)
    desa_id = db.Column(db.BigInteger, db.ForeignKey('desa.id'))  # Ubah menjadi desa_id untuk mengikuti konvensi penamaan
    desa = db.relationship('Desa', backref='sejarahs')  # Menambahkan hubungan dengan entitas Desa

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'foto': self.foto,
            'deskripsi': self.deskripsi,
            'desa_id': self.desa_id,
            # Tambahkan atribut lain jika diperlukan
        }

    def __repr__(self):
        return '<Sejarah {}>'.format(self.name)
