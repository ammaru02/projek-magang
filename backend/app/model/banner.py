from app import db

class Banner(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    gambar = db.Column(db.String(50), nullable=False)
    url_gambar = db.Column(db.String(255), nullable=False)  # Menambahkan kolom untuk URL gambar
    
    def __repr__(self):
        return '<Banner {}>'.format(self.name)
