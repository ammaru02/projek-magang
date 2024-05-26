from app.model.struktur import Struktur
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
        struktur = Struktur.query.all()
        data = format_array(struktur)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def format_array(datas):
    array = []
    for i in datas:
        array.append(single_object(i))
    return array
        
def single_object(struktur):
    return {
        'id': struktur.id,
        'name': struktur.name,
        'foto': struktur.foto,
        'jabatan': struktur.jabatan,
        'desaId': struktur.desaId,
    }

def get(id):
    try:
        struktur = Struktur.query.get(id)
        if struktur is None:
            return jsonify({'message': 'Struktur not found'}), 404

        return jsonify(single_object(struktur)), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def create():
    try:
        data = request.form
        foto_file = request.files['foto']  # Ubah ini menjadi 'foto'
        foto_data = foto_file.read()  # Baca data biner dari file
        foto_url = upload_to_firebase_storage(foto_file.filename, foto_data)
        
        struktur = Struktur(
            name=data.get('name'),
            jabatan=data.get('jabatan'),
            foto=foto_url,
            desaId=data.get('desaId')
        )
        db.session.add(struktur)
        db.session.commit()

        return jsonify({'message': 'Struktur added successfully'}), 201
    except KeyError:
        # Jika kunci 'foto' tidak ditemukan pada request.files
        return jsonify({'error': 'No file provided in the request'}), 400
    except Exception as e:
        # Tangkap kesalahan umum dan kembalikan pesan kesalahan yang lebih deskriptif
        return jsonify({'error': 'Failed to add struktur', 'message': str(e)}), 500

def update(id):
    struktur = Struktur.query.get(id)
    if not struktur:
        return jsonify({'message': 'Struktur not found'}), 404

    try:
        data = request.get_json()  # Ubah untuk mendapatkan payload JSON
        print('Data received:', data)  # Logging for debugging

        if 'name' in data:
            struktur.name = data['name']
        if 'jabatan' in data:
            struktur.jabatan = data['jabatan']
        if 'desaId' in data:
            struktur.desaId = data['desaId']
        if 'foto' in data:  # Menggunakan URL yang sudah di-upload
            struktur.foto = data['foto']

        print('Updating struktur:', struktur)  # Logging for debugging

        db.session.commit()  # Commit transaksi ke database
        return jsonify({'message': 'Struktur updated successfully'}), 200
    except Exception as e:
        db.session.rollback()  # Rollback transaksi jika terjadi kesalahan
        return jsonify({'message': str(e)}), 500

def delete(id):
    struktur = Struktur.query.get(id)
    if not struktur:
        return jsonify({'message': 'Struktur not found'}), 404
    
    try:
        db.session.delete(struktur)
        db.session.commit()
        return jsonify({'message': 'Struktur deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
