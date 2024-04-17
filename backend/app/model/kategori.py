from app import db


class Kategori(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    
    def __repr__(self):
        return '<Kategori {}>'.format(self.name)