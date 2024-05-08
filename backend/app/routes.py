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

@app.route('/produk', methods=['GET', 'POST'])
def produks():
    if request.method == 'POST':
        try:
            kategori_id = request.form.get('kategori_id')
            name = request.form.get('name')
            harga = request.form.get('harga')
            deskripsi = request.form.get('deskripsi')

            # Proses penyimpanan gambar ke firebase
            # ...

            # Simpan data produk ke database
            new_produk = Produk(kategori_id=kategori_id, name=name, harga=harga, deskripsi=deskripsi)
            db.session.add(new_produk)
            db.session.commit()

            return jsonify({'message': 'success'}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 500
    elif request.method == 'PUT':  # Menambahkan kondisi untuk metode PUT
        return ProdukController.update(request)  # Panggil fungsi update dengan parameter request
    else:
        return ProdukController.index()
    
@app.route('/produk/<int:id>', methods=['GET', 'PUT'])
def get_or_update_produk(id):
    if request.method == 'GET':
        return ProdukController.get(id)
    elif request.method == 'PUT':
        return ProdukController.update(id)

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
