from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import routes
from app.model import admin, banner, artikel, desa, deskripsi_produk, kategori, produk, sejarah, struktur, visi, warga, misi
