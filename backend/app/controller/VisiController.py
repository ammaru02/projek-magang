from app.model.visi import Visi
from app import response
from flask import request, jsonify
from app import db

def index():
    try:
        visi = Visi.query.all()
        return jsonify([v.serialize() for v in visi]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update():
    try:
        data = request.json
        visi = Visi.query.first()
        if not visi:
            return jsonify({'message': 'No visi found'}), 404
        
        if 'visi' in data:
            visi.visi = data['visi']
        
        # Periksa apakah foto ada dalam data dan apakah ada foto baru yang disertakan dalam permintaan
        if 'foto' in data and data['foto'] != visi.foto:
            visi.foto = data['foto']
        
        db.session.commit()
        return jsonify({'message': 'Visi updated successfully'}), 200
    except Exception as e:
        db.session.rollback()  
        return jsonify({'message': str(e)}), 500

def format_array(datas):
    return [single_object(data) for data in datas]
        
def single_object(visi):
    return {
        'id': visi.id,
        'visi': visi.visi,
        'foto': visi.foto,
    }
