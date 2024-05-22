from flask import jsonify, request
from flask_cors import cross_origin
from app.model.produk import Produk
from app.model.artikel import Artikel
from app.model.sejarah import Sejarah
from app.model.visi import Visi
from app.model.misi import Misi
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
        try:
            data = request.json
            judul = data.get('judul')
            tanggal = data.get('tanggal')
            foto = data.get('foto')
            deskripsi = data.get('deskripsi')

            if not (judul and tanggal and foto and deskripsi):
                return jsonify({'message': 'Incomplete data provided'}), 400

            new_artikel = Artikel(
                judul=judul,
                tanggal=tanggal,
                foto=foto,
                deskripsi=deskripsi
            )
            db.session.add(new_artikel)
            db.session.commit()

            return jsonify({'message': 'Article added successfully'}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 500
    elif request.method == 'GET':
        try:
            artikels = Artikel.query.all()
            artikel_list = [artikel.serialize() for artikel in artikels]
            return jsonify(artikel_list), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        
@app.route('/artikel/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def get_update_or_delete_artikel(id):
    artikel = Artikel.query.get(id)
    if not artikel:
        return jsonify({'message': 'Article not found'}), 404

    if request.method == 'GET':
        return jsonify(artikel.serialize()), 200
    elif request.method == 'PUT':
        try:
            data = request.json
            if 'judul' in data:
                artikel.judul = data['judul']
            if 'tanggal' in data:
                artikel.tanggal = data['tanggal']
            if 'foto' in data:
                artikel.foto = data['foto']
            if 'deskripsi' in data:
                artikel.deskripsi = data['deskripsi']

            db.session.commit()
            return jsonify({'message': 'Article updated successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
    elif request.method == 'DELETE':
        try:
            db.session.delete(artikel)
            db.session.commit()

            # Reset auto-increment (for SQLite)
            db.session.execute('VACUUM')
            db.session.commit()

            return jsonify({'message': 'Article deleted successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500

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
        
@app.route('/produk/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def get_update_or_delete_produk(id):
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
    elif request.method == 'DELETE':
        try:
            db.session.delete(produk)
            db.session.commit()
            return jsonify({'message': 'Product deleted successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500

@app.route('/sejarah', methods=['GET', 'PUT'])
def get_update_sejarah():
    if request.method == 'GET':
        try:
            sejarah = Sejarah.query.all()
            return jsonify([s.serialize() for s in sejarah]), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
    elif request.method == 'PUT':
        try:
            data = request.json
            sejarah = Sejarah.query.first()  # Ambil sejarah pertama untuk diperbarui (atau disesuaikan sesuai kebutuhan)
            if not sejarah:
                return jsonify({'message': 'Tidak ada sejarah ditemukan'}), 404
            
            if 'deskripsi' in data:
                sejarah.deskripsi = data['deskripsi']
            if 'foto' in data:  # Perbarui foto jika ada di data yang dikirimkan
                sejarah.foto = data['foto'] 
            
            db.session.commit()
            return jsonify({'message': 'Sejarah berhasil diperbarui'}), 200
        except Exception as e:
            db.session.rollback()  # Rollback perubahan jika terjadi kesalahan
            return jsonify({'message': str(e)}), 500

@app.route('/struktur', methods=['GET', 'POST'])
def strukturs():
    if request.method == 'POST':
        return StrukturController.create()
    else:
        return StrukturController.index()

@app.route('/visi', methods=['GET', 'PUT'])
def get_update_visi():
    if request.method == 'GET':
        try:
            visi = Visi.query.all()
            return jsonify([v.serialize() for v in visi]), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
    elif request.method == 'PUT':
        try:
            data = request.json
            visi = Visi.query.first()  # Ambil visi pertama untuk diperbarui (atau Anda bisa sesuaikan sesuai kebutuhan)
            if not visi:
                return jsonify({'message': 'No visi found'}), 404
            
            if 'visi' in data:
                visi.visi = data['visi']
            if 'foto' in data:
                visi.foto = data['foto']

            db.session.commit()
            return jsonify({'message': 'Visi updated successfully'}), 200
        except Exception as e:
            db.session.rollback()  # Rollback perubahan jika terjadi kesalahan
            return jsonify({'message': str(e)}), 500

@app.route('/misi', methods=['GET', 'PUT'])
def get_update_misi():
    if request.method == 'GET':
        try:
            misi = Misi.query.all()
            return jsonify([m.serialize() for m in misi]), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
    elif request.method == 'PUT':
        try:
            data = request.json
            misi = Misi.query.first()  # Ambil misi pertama untuk diperbarui (atau Anda bisa sesuaikan sesuai kebutuhan)
            if not misi:
                return jsonify({'message': 'No misi found'}), 404
            
            if 'misi' in data:
                misi.misi = data['misi']
            if 'visi_id' in data:
                misi.visi_id = data['visi_id']

            db.session.commit()
            return jsonify({'message': 'Misi updated successfully'}), 200
        except Exception as e:
            db.session.rollback()  # Rollback perubahan jika terjadi kesalahan
            return jsonify({'message': str(e)}), 500

@app.route('/keunggulan', methods=['GET', 'POST'])
def keunggulans():
    if request.method == 'POST':
        return KeunggulanController.create()
    else:
        return KeunggulanController.index()
    
@app.route('/keunggulan/<int:id>', methods=['GET'])
def get_keunggulan(id):
    return KeunggulanController.get(id)
