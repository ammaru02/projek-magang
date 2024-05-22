from app.model.misi import Misi
from app import response
from flask import request
from app import db

def index():
    try:
        misi = Misi.query.all()
        data = formatarray(misi)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def update(id, request):
    try:
        misi = Misi.query.filter_by(id=id).first()

        if not misi:
            return response.error([], 'Misi tidak ditemukan.')

        misi.misi = request.json['misi']
        misi.visiId = request.json['visiId']

        db.session.commit()

        return response.success('', 'Misi berhasil diperbarui.')
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(misi):
    misi = {
        'id' : misi.id,
        'misi' : misi.misi,
        'visiId' : misi.visiId
    }
    return misi
