from app.model.visi import Visi
from app import response
from flask import request
from app import db

def index():
    try:
        visi = Visi.query.all()
        data = formatarray(visi)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def update(id, request):
    try:
        visi = Visi.query.filter_by(id=id).first()

        if not visi:
            return response.error([], 'Visi tidak ditemukan.')

        visi.visi = request.json['visi']
        visi.foto = request.json['foto'] if 'foto' in request.json else None

        db.session.commit()

        return response.success('', 'Visi berhasil diperbarui.')
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(visi):
    visi = {
        'id' : visi.id,
        'visi' : visi.visi,
        'foto' : visi.foto,
    }
    return visi
