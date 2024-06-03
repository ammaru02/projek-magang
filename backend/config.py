import os

class Config(object):
    # Konfigurasi database
    HOST = os.environ.get("DB_HOST", "127.0.0.1:3306")
    DATABASE = os.environ.get("DB_DATABASE", "web_desa")
    USERNAME = os.environ.get("DB_USERNAME", "root")
    PASSWORD = os.environ.get("DB_PASSWORD", "")

    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}/{DATABASE}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_RECORD_QUERIES = True
    SECRET_KEY = os.environ.get("SECRET_KEY", "50f51f06bbe352e0b28826360c9af07c8768e479c8000e97")

    # Konfigurasi Mail dengan Gmail
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "true").lower() in ["true", "on", "1"]
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME", "desadigitalisasi@gmail.com")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD", "csev mejf szvu mujg")
