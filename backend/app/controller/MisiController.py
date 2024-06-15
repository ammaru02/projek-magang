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
        misi = Misi.query.first()  # Retrieve the first 'misi' entry to update (or adjust as needed)
        if not misi:
            return jsonify({'message': 'No misi found'}), 404
        
        if 'misi' in data:
            misi.misi = data['misi']  # Expecting HTML content from ReactQuill
        if 'visi' in data:
            misi.visi = data['visi']  # Expecting HTML content from ReactQuill
        db.session.commit()
        return jsonify({'message': 'Misi updated successfully'}), 200
    except Exception as e:
        db.session.rollback()  # Rollback changes in case of error
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
        'visi' : misi.visi
    }
    return misi
