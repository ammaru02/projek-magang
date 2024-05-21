from flask import request
from app import response
from app.model.artikel import Artikel
from app import db

def index():
    try:
        artikel = Artikel.query.all()
        data = formatarray(artikel)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def create(request):
    try:
        # Pastikan bidang-bidang yang diperlukan ada dalam permintaan dari klien
        judul = request.json['judul']
        tanggal = request.json['tanggal']
        foto = request.json['foto'] if 'foto' in request.json else None  # pastikan foto ada dalam request
        deskripsi = request.json['deskripsi']
        desa_id = request.json['desaId']

        # Buat objek Artikel baru dan simpan ke basis data
        artikel = Artikel(judul=judul, tanggal=tanggal, foto=foto, deskripsi=deskripsi, desaId=desa_id)
        db.session.add(artikel)
        db.session.commit()

        return response.success('', 'Artikel berhasil ditambahkan.')
    except Exception as e:
        return response.error([], str(e))

def update(id, request):
    try:
        # Temukan artikel dengan ID yang sesuai dalam basis data
        artikel = Artikel.query.filter_by(id=id).first()

        if not artikel:
            return response.error([], 'Artikel tidak ditemukan.')

        # Update bidang-bidang artikel sesuai dengan data yang dikirimkan dari klien
        artikel.judul = request.json['judul']
        artikel.tanggal = request.json['tanggal']
        artikel.foto = request.json['foto'] if 'foto' in request.json else None  # pastikan foto ada dalam request
        artikel.deskripsi = request.json['deskripsi']
        artikel.desaId = request.json['desaId']

        # Simpan perubahan ke basis data
        db.session.commit()

        return response.success('', 'Artikel berhasil diperbarui.')
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(artikel):
    artikel = {
        'id' : artikel.id,
        'judul' : artikel.judul,
        'tanggal' : artikel.tanggal,
        'foto' : artikel.foto,
        'deskripsi' : artikel.deskripsi,
        'desaId' : artikel.desaId
    }
    return artikel
