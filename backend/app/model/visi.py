from app import db
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

class Visi(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    visi = db.Column(db.String(250), nullable=False)
    foto = db.Column(db.String(500), nullable=False)

    def _repr_(self):
        return '<Visi {}>'.format(self.visi)

    def serialize(self):
        return {
            'id': self.id,
            'visi': self.visi,
            'foto': self.foto
        }
