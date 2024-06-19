from app import db

class Banner(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    url_gambar = db.Column(db.String(255), nullable=False)
    
    def __repr__(self):
        return '<Banner {}>'.format(self.name)
