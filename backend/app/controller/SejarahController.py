from app.model.sejarah import Sejarah
from app import response, db
from flask import request

def index():
    try:
        sejarah = Sejarah.query.all()
        data = format_array(sejarah)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def update(id):
    try:
        sejarah = Sejarah.query.filter_by(id=id).first()

        if not sejarah:
            return response.error([], 'Sejarah tidak ditemukan.')

        sejarah.name = request.json['name']
        sejarah.foto = request.json['foto']
        sejarah.deskripsi = request.json['deskripsi']
        sejarah.desa_id = request.json['desa_id']

        db.session.commit()

        return response.success('', 'Sejarah berhasil diperbarui.')
    except Exception as e:
        return response.error([], str(e))

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
