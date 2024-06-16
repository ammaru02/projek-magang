from flask import jsonify, request
from app import response
from app.model.artikel import Artikel
from app import db

def index():
    try:
        artikels = Artikel.query.all()
        artikel_list = [artikel.serialize() for artikel in artikels]
        return jsonify(artikel_list), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def get(id):
    artikel = Artikel.query.get(id)
    if not artikel:
        return jsonify({'message': 'Article not found'}), 404

def create():
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

def update(id):
    artikel = Artikel.query.get(id)
    if not artikel:
        return jsonify({'message': 'Article not found'}), 404
    
    try:
        data = request.json
        if 'judul' in data:
            artikel.judul = data['judul']
        if 'tanggal' in data:
            artikel.tanggal = data['tanggal']
        if 'foto' in data:
            artikel.foto = data['foto']
        if 'deskripsi' in data:
            artikel.deskripsi = data['deskripsi']  # Update deskripsi dengan data dari request
        db.session.commit()
        return jsonify({'message': 'Article updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def delete(id):
    artikel = Artikel.query.get(id)
    if not artikel:
        return jsonify({'message': 'Artikel not found'}), 404
    
    try:
        db.session.delete(artikel)
        db.session.commit()
        return jsonify({'message': 'Artikel deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
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
