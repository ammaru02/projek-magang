from flask import jsonify, request
from flask_cors import cross_origin
from app.model.produk import Produk
from app import app, db
from app.controller import DesaController, VisiController, WargaController, AdminController, ArtikelController, KategoriController, ProdukController, SejarahController, StrukturController, MisiController, KeunggulanController
from app.model.banner import Banner  

@app.route('/')
def index():
    return 'Hellow Ammar'

@app.route('/desa', methods=['GET', 'POST'])
def desas():
    if request.method == 'POST':
        return DesaController.create()
    else:
        return DesaController.index()

@app.route('/warga', methods=['GET', 'POST'])
def wargas():
    if request.method == 'POST':
        return WargaController.create()
    else:
        return WargaController.index()

@app.route('/warga/<int:id>', methods=['GET'])
def get_warga(id):
    return WargaController.get(id)

@app.route('/banner', methods=['POST'])
def add_banner():
    data = request.get_json()
    new_banner = Banner(gambar=data['gambar'], url_gambar=data['url_gambar'])
    db.session.add(new_banner)
    db.session.commit()
    return {'id': new_banner.id}, 201

@app.route('/banner', methods=['GET'])
def get_banners():
    try:
        banners = Banner.query.all()
        return jsonify([{'id': banner.id, 'gambar': banner.gambar, 'url_gambar': banner.url_gambar} for banner in banners])
    except Exception as e:
        return str(e), 500
    
@app.route("/api/saveImage", methods=['POST'])
@cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
def save_image():
    data = request.get_json()
    if 'url' not in data:
        return "No URL provided.", 400

    url = data['url']

    # Now you can save the URL to your database
    new_banner = Banner(url_gambar=url)
    db.session.add(new_banner)
    db.session.commit()

@app.route('/admin', methods=['GET', 'POST'])
def admins():
    if request.method == 'POST':
        return AdminController.create()
    else:
        return AdminController.index()

@app.route('/artikel', methods=['GET', 'POST'])
def artikels():
    if request.method == 'POST':
        return ArtikelController.create()
    else:
        return ArtikelController.index()

@app.route('/kategori', methods=['GET', 'POST'])
def kategoris():
    if request.method == 'POST':
        return KategoriController.create()
    else:
        return KategoriController.index()

from flask import request, jsonify

@app.route('/produk', methods=['GET', 'POST'])
def produks():
    if request.method == 'POST':
        try:
            data = request.json
            kategori_id = data.get('kategori_id')
            name = data.get('name')
            harga = data.get('harga')
            deskripsi = data.get('deskripsi')
            foto_url = data.get('foto')

            if not (kategori_id and name and harga and deskripsi and foto_url):
                return jsonify({'message': 'Incomplete data provided'}), 400

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
    elif request.method == 'GET':
        try:
            produk = Produk.query.all()
            produk_list = [p.serialize() for p in produk]
            return jsonify(produk_list), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500

@app.route('/produk/<int:id>', methods=['GET', 'PUT'])
def get_or_update_produk(id):
    produk = Produk.query.get(id)
    if not produk:
        return jsonify({'message': 'Produk not found'}), 404

    if request.method == 'GET':
        return jsonify(produk.serialize()), 200
    elif request.method == 'PUT':
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

@app.route('/sejarah', methods=['GET', 'POST'])
def sejarahs():
    if request.method == 'POST':
        return SejarahController.create()
    else:
        return SejarahController.index()

@app.route('/struktur', methods=['GET', 'POST'])
def strukturs():
    if request.method == 'POST':
        return StrukturController.create()
    else:
        return StrukturController.index()

@app.route('/visi', methods=['GET', 'POST'])
def visis():
    if request.method == 'POST':
        return VisiController.create()
    else:
        return VisiController.index()

@app.route('/misi', methods=['GET', 'POST'])
def misis():
    if request.method == 'POST':
        return MisiController.create()
    else:
        return MisiController.index()
    
@app.route('/keunggulan', methods=['GET', 'POST'])
def keunggulans():
    if request.method == 'POST':
        return KeunggulanController.create()
    else:
        return KeunggulanController.index()
    
@app.route('/keunggulan/<int:id>', methods=['GET'])
def get_keunggulan(id):
    return KeunggulanController.get(id)
