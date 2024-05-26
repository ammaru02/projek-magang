from app import db

class Visi(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    visi = db.Column(db.String(250), nullable=False)
    foto = db.Column(db.String(500), nullable=False)

    def __repr__(self):
        return '<Visi {}>'.format(self.visi)

    def serialize(self):
        return {
            'id': self.id,
            'visi': self.visi,
            'foto': self.foto
        }
