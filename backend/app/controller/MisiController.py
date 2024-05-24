from app.model.misi import Misi
from app import response
from flask import request, jsonify
from app import db

def index():
    try:
        misi = Misi.query.all()
        return jsonify([m.serialize() for m in misi]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update():
    try:
        data = request.json
        misi = Misi.query.first()  # Ambil misi pertama untuk diperbarui (atau Anda bisa sesuaikan sesuai kebutuhan)
        if not misi:
            return jsonify({'message': 'No misi found'}), 404
            
        if 'misi' in data:
            misi.misi = data['misi']
        if 'visi_id' in data:
            misi.visi_id = data['visi_id']
        db.session.commit()
        return jsonify({'message': 'Misi updated successfully'}), 200
    except Exception as e:
        db.session.rollback()  # Rollback perubahan jika terjadi kesalahan
        return jsonify({'message': str(e)}), 500

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(misi):
    misi = {
        'id' : misi.id,
        'misi' : misi.misi,
        'visiId' : misi.visiId
    }
    return misi
