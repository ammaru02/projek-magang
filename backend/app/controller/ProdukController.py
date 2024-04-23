from app.model.produk import Produk
from app import response
from flask import request
from flask import jsonify

def index():
    try:
        # Mengambil parameter kategoriId dari URL jika ada
        kategori_id = request.args.get('kategoriId')
        
        if kategori_id:
            # Jika kategoriId diberikan, filter produk berdasarkan kategoriId
            produk = Produk.query.filter_by(kategori_id=kategori_id).all()
        else:
            # Jika kategoriId tidak diberikan, ambil semua produk
            produk = Produk.query.all()
        
        # Format data produk sesuai kebutuhan
        data = formatarray(produk)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(produk):
    produk = {
        'id' : produk.id,
        'name' : produk.name,
        'harga' : produk.harga,
        'deskripsi' : produk.deskripsi,
        'desa_id' : produk.desa_id,
        'warga_id' : produk.warga_id,
        'kategori_id' : produk.kategori_id,
    }
    return produk

def get(id):
    produk = Produk.query.get(id)
    if produk is None:
        return jsonify({'message': 'Produk not found'}), 404

    produk_dict = {
        'id': produk.id,
        'name': produk.name,
        'deskripsi': produk.deskripsi,
        'harga': produk.harga,
        'kategori_id': produk.kategori_id,
        'warga_id': produk.warga_id,
    }

    return jsonify(produk_dict), 200
