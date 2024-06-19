from flask import Flask
from config import Config  # Ubah impor ini
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_debugtoolbar import DebugToolbarExtension
from flask_mail import Mail
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*")
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
toolbar = DebugToolbarExtension(app)

from app import routes
from app.model import admin, banner, artikel, desa, deskripsi_produk, kategori, produk, sejarah, visi, warga, misi, keunggulan, warga
from app.routes import register_routes
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

mail = Mail(app)

register_routes(app)
