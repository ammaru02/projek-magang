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
            produk = Produk.query.filter_by(kategori_id=kategori_id).order_by(Produk.id.desc()).all()
        else:
            produk = Produk.query.order_by(Produk.id.desc()).all()
        produk_list = [p.serialize() for p in produk]
        return jsonify(produk_list), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

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
    produk = Produk.query.get(id)
    if not produk:
        return jsonify({'message': 'Produk not found'}), 404
    return jsonify(single_object(produk)), 200

def create():
    try:
        data = request.json
        kategori_id = data.get('kategori_id')
        name = data.get('name')
        harga = data.get('harga')
        deskripsi = data.get('deskripsi')
        foto_url = data.get('foto')

        if not (kategori_id and name and harga and deskripsi and foto_url):
            return jsonify({'message': 'Incomplete data provided'}), 400

        # Check if a product with the same name already exists in the same category
        existing_product_same_category = Produk.query.filter_by(name=name, kategori_id=kategori_id).first()
        if existing_product_same_category:
            return jsonify({'message': f"Product with name '{name}' already exists in this category."}), 400

        # Set desa_id dan warga_id ke 1
        desa_id = 1
        warga_id = 1

        new_produk = Produk(
            kategori_id=kategori_id,
            name=name,
            harga=harga,
            deskripsi=deskripsi,
            foto=foto_url,
            desa_id=desa_id,
            warga_id=warga_id
        )
        db.session.add(new_produk)
        db.session.commit()

        return jsonify({'message': 'Product added successfully'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
        
def update(id):
    produk = Produk.query.get(id)
    try:
        data = request.json
        if 'name' in data:
            produk.name = data['name']
        if 'harga' in data:
            produk.harga = data['harga']
        if 'deskripsi' in data:
            produk.deskripsi = data['deskripsi']
        if 'kategori_id' in data:
            produk.kategori_id = data['kategori_id']
        if 'foto' in data:
            produk.foto = data['foto']

        db.session.commit()
        return jsonify({'message': 'Product updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def delete(id):
    produk = Produk.query.get(id)
    try:
        db.session.delete(produk)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
