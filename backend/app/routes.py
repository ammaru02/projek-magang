from flask import jsonify, request
from flask import Blueprint
from flask_cors import cross_origin
from app import app, db
from app.controller import DesaController, WargaController, ArtikelController, SejarahController, MisiController, VisiController, ProdukController, AdminController, KategoriController, StrukturController, KeunggulanController
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

def register_routes(app):
    @app.route('/admin', methods=['GET', 'POST'])
    def admin():
        if request.method == 'GET':
            return AdminController.index()
        elif request.method == 'POST':
            return AdminController.create()

    @app.route('/admin/<int:id>', methods=['GET'])
    def get_admin(id):
        return AdminController.get(id)

    @app.route('/admin/<int:id>/password', methods=['PUT'])
    def update_admin_password(id):
        return AdminController.update_password(id)

    @app.route('/request-admin-password-reset', methods=['POST'])
    def request_admin_password_reset():
        return AdminController.request_password_reset()

    @app.route('/reset-password', methods=['POST'])
    def reset_password():
        return AdminController.reset_password()
    
    @app.route('/login', methods=['POST'])
    def login():
        return AdminController.login()

    @app.route('/admin/profile', methods=['GET'])
    @cross_origin()
    def admin_profile():
        return AdminController.get_profile()

    @app.route('/admin/profile', methods=['OPTIONS'])
    def handle_admin_profile_options():
        return '', 200 

@app.route('/artikel', methods=['GET', 'POST'])
def artikels():
    if request.method == 'POST':
        return ArtikelController.create()
    elif request.method == 'GET':
        return ArtikelController.index()
        
@app.route('/artikel/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def get_update_or_delete_artikel(id):
    if request.method == 'GET':
        return ArtikelController.get(id)
    elif request.method == 'PUT':
        return ArtikelController.update(id)
    elif request.method == 'DELETE':
        return ArtikelController.delete(id)

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
        return ProdukController.create()
    elif request.method == 'GET':
        return ProdukController.index()
        
@app.route('/produk/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def get_update_or_delete_produk(id):
    if request.method == 'GET':
        return ProdukController.get(id)
    elif request.method == 'PUT':
        return ProdukController.update(id)
    elif request.method == 'DELETE':
        return ProdukController.delete(id)

@app.route('/sejarah', methods=['GET', 'PUT'])
def get_update_sejarah():
    if request.method == 'GET':
        return SejarahController.index()
    elif request.method == 'PUT':
        return SejarahController.update()

@app.route('/struktur', methods=['GET', 'POST'])
def strukturs():
    if request.method == 'POST':
        return StrukturController.create()
    elif request.method == 'GET':
        return StrukturController.index()

@app.route('/struktur/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def get_update_or_delete_struktur(id):
    if request.method == 'GET':
        return StrukturController.get(id)
    elif request.method == 'PUT':
        return StrukturController.update(id)
    elif request.method == 'DELETE':
        return StrukturController.delete(id)


@app.route('/visi', methods=['GET', 'PUT'])
def get_update_visi():
    if request.method == 'GET':
        return VisiController.index()
    elif request.method == 'PUT':
        return VisiController.update()

@app.route('/misi', methods=['GET', 'PUT'])
def get_update_misi():
    if request.method == 'GET':
        return MisiController.index()
    elif request.method == 'PUT':
        return MisiController.update()

@app.route('/keunggulan', methods=['GET', 'POST'])
def keunggulans():
    if request.method == 'POST':
        return KeunggulanController.create()
    elif request.method == 'GET':
        return KeunggulanController.index()

@app.route('/keunggulan/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def get_update_or_delete_keunggulan(id):
    if request.method == 'GET':
        return KeunggulanController.get(id)
    elif request.method == 'PUT':
        return KeunggulanController.update(id)
    elif request.method == 'DELETE':
        return KeunggulanController.delete(id)