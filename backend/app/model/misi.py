from app import db

class Misi(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    misi = db.Column(db.String(2500), nullable=False)
    visiId = db.Column(db.BigInteger, db.ForeignKey('visi.id'))

    def serialize(self):
        return {
            'id': self.id,
            'misi': self.misi,
            'visiId': self.visiId
            # Tambahkan atribut lain jika diperlukan
        }

    def __repr__(self):
        return '<Misi {}>'.format(self.misi)
