from app.model.keunggulan import Keunggulan
from app import response
from flask import jsonify

def index():
    try:
        keunggulan = Keunggulan.query.all()
        
        # Format data produk sesuai kebutuhan
        data = formatarray(keunggulan)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(keunggulan):
    keunggulan = {
        'id' : keunggulan.id,
        'foto' : keunggulan.foto,
        'deskripsi' : keunggulan.deskripsi,
        'desa_id' : keunggulan.desa_id,
    }
    return keunggulan

def get(id):
    keunggulan = Keunggulan.query.get(id)
    if keunggulan is None:
        return jsonify({'message': 'Keunggulan not found'}), 404

    keunggulan_dict = {
        'id': keunggulan.id,
        'foto': keunggulan.foto,
        'deskripsi': keunggulan.deskripsi,
    }

    return jsonify(keunggulan_dict), 200
