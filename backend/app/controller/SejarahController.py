from app.model.sejarah import Sejarah
from app import response, db
from flask import request, jsonify

def index():
    try:
        sejarah = Sejarah.query.all()
        return jsonify([s.serialize() for s in sejarah]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update():
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

def format_array(datas):
    return [single_object(data) for data in datas]
        
def single_object(sejarah):
    return {
        'id': sejarah.id,
        'name': sejarah.name,
        'foto': sejarah.foto,
        'deskripsi': sejarah.deskripsi,
        'desa_id': sejarah.desa_id
    }
