from app.model.keunggulan import Keunggulan
from app import response, db
from flask import request, jsonify
from firebase_admin import storage

# Function to upload file to Firebase Storage
def upload_to_firebase_storage(file):
    bucket = storage.bucket()
    blob = bucket.blob(file.filename)
    blob.upload_from_file(file)
    blob.make_public()  # Make the image URL public
    return blob.public_url

def index():
    try:
        keunggulan = Keunggulan.query.all()
        data = formatarray(keunggulan)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(keunggulan):
    return {
        'id': keunggulan.id,
        'foto': keunggulan.foto,
        'deskripsi': keunggulan.deskripsi,
        'desa_id': keunggulan.desa_id,
    }

def get(id):
    try:
        keunggulan = Keunggulan.query.get(id)
        if keunggulan is None:
            return jsonify({'message': 'Keunggulan not found'}), 404

        return jsonify(singleObject(keunggulan)), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def create():
    try:
        data = request.json
        keunggulan = Keunggulan(
            deskripsi=data.get('deskripsi'),
            foto=data.get('foto')
        )
        db.session.add(keunggulan)
        db.session.commit()

        return jsonify({'message': 'Keunggulan added successfully'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
        
def update(id):
    keunggulan = Keunggulan.query.get(id)
    if not keunggulan:
        return jsonify({'message': 'Keunggulan not found'}), 404
    
    try:
        data = request.json
        if 'deskripsi' in data:
            keunggulan.deskripsi = data['deskripsi']
        if 'foto' in data:
            keunggulan.foto = data['foto']

        db.session.commit()
        return jsonify({'message': 'Keunggulan updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def delete(id):
    keunggulan = Keunggulan.query.get(id)
    if not keunggulan:
        return jsonify({'message': 'Keunggulan not found'}), 404
    
    try:
        db.session.delete(keunggulan)
        db.session.commit()
        return jsonify({'message': 'Keunggulan deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500