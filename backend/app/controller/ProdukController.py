from app.model.produk import Produk
from app import response, db
from flask import request, jsonify
from firebase_admin import storage

# Fungsi untuk mengunggah file ke Firebase Storage
def upload_to_firebase_storage(file):
    bucket = storage.bucket()
    blob = bucket.blob(file.filename)
    blob.upload_from_file(file)
    blob.make_public()  # Membuat URL gambar publik
    return blob.public_url

def index():
    try:
        kategori_id = request.args.get('kategoriId')
        
        if kategori_id:
            produk = Produk.query.filter_by(kategori_id=kategori_id).all()
        else:
            produk = Produk.query.all()
        
        print(produk)  # Debugging line
        data = format_array(produk)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def format_array(datas):
    array = []
    for i in datas:
        array.append(single_object(i))
    return array
        
def single_object(produk):
    return {
        'id': produk.id,
        'name': produk.name,
        'foto': produk.foto,
        'harga': produk.harga,
        'deskripsi': produk.deskripsi,
        'desa_id': produk.desa_id,
        'warga_id': produk.warga_id,
        'kategori_id': produk.kategori_id,
    }

def get(id):
    try:
        produk = Produk.query.get(id)
        if produk is None:
            return jsonify({'message': 'Produk not found'}), 404

        return jsonify(single_object(produk)), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update(id):
    try:
        produk = Produk.query.get(id)
        if produk is None:
            return jsonify({'message': 'Produk not found'}), 404
        
        data = request.json
        if 'name' in data:
            produk.name = data['name']
        if 'harga' in data:
            produk.harga = data['harga']
        if 'deskripsi' in data:
            produk.deskripsi = data['deskripsi']
        if 'kategori_id' in data:
            produk.kategori_id = data['kategori_id']

        if 'foto' in request.files:
            foto = request.files['foto']
            if foto.filename != '':
                foto_url = upload_to_firebase_storage(foto)
                produk.foto = foto_url
        
        db.session.commit()
        
        return jsonify({'message': 'Product updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def delete(id):
    try:
        produk = Produk.query.get(id)
        if produk is None:
            return jsonify({'message': 'Produk not found'}), 404
        
        if produk.foto:
            bucket = storage.bucket()
            blob = bucket.blob(produk.foto)
            blob.delete()

        db.session.delete(produk)
        db.session.commit()
        
        return jsonify({'message': 'Product and its photo deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
