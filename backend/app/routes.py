from flask import jsonify, request
from flask import Blueprint
from flask_cors import cross_origin
from app.model.admin import Admin
from app import app, db
from app.controller import DesaController, WargaController, ArtikelController, SejarahController, MisiController, VisiController, ProdukController, AdminController, KategoriController, KeunggulanController, BannerController
from app.model.banner import Banner  
from app.controller.AdminController import token_required

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

@app.route('/banner', methods=['GET', 'POST'])
def banners():
    if request.method == 'POST':
        return BannerController.create()
    elif request.method == 'GET':
        return BannerController.index()

@app.route('/banner/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def get_update_or_delete_banner(id):
    if request.method == 'GET':
        return BannerController.get(id)
    elif request.method == 'PUT':
        return BannerController.update(id)
    elif request.method == 'DELETE':
        return BannerController.delete(id)
    
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
    @token_required
    def adminProfile(current_user):
        return AdminController.get_admin_profile(current_user)

    @app.route('/admin/profile', methods=['OPTIONS'])
    def handle_admin_profile_options():
        return '', 200
    
    @app.route('/forgot-password', methods=['POST'])
    def forgot_password():
        return AdminController.forgot_password()
    
    @app.route('/generate-token', methods=['POST'])
    def generate_token():
        return AdminController.generate_token()
def register_routes(app):
    @app.route('/admin', methods=['GET', 'POST'])
    def admin():
        if request.method == 'GET':
            return AdminController.index()
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
    @token_required
    def adminProfile(current_user):
        return AdminController.get_admin_profile(current_user)
    
    @app.route('/admin/profile/password', methods=['PUT'])
    @token_required
    def adminProfilePassword(current_user):
        return AdminController.change_password(current_user)

    @app.route('/admin/profile', methods=['OPTIONS'])
    def handle_admin_profile_options():
        return '', 200
    
    @app.route('/forgot-password', methods=['POST'])
    def forgot_password():
        return AdminController.forgot_password()
    
    @app.route('/generate-token', methods=['POST'])
    def generate_token():
        return AdminController.generate_token()

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

@app.route('/kategori/<int:id>', methods=['PUT', 'DELETE'])
def kategori_detail(id):
    if request.method == 'PUT':
        return KategoriController.update(id)
    elif request.method == 'DELETE':
        return KategoriController.delete(id)

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