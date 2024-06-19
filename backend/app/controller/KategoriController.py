from flask import request, jsonify
from app.model.kategori import Kategori
from app import response, db

def index():
    try:
        kategoris = Kategori.query.all()
        data = formatarray(kategoris)
        return response.success(data, "Success")
    except Exception as e:
        return response.error([], str(e))

def create():
    try:
        data = request.json
        name = data.get('name')
        foto = data.get('foto')

        # Check if a category with the same name already exists
        if Kategori.query.filter_by(name=name).first():
            return jsonify({'message': f"Category with name '{name}' already exists"}), 400

        new_kategori = Kategori(name=name, foto=foto)
        db.session.add(new_kategori)
        db.session.commit()

        return jsonify({'message': "Category added successfully", 'kategori': singleObject(new_kategori)}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
        
def update(id):
    try:
        data = request.json
        kategori = Kategori.query.get(id)

        if not kategori:
            return response.error([], "Category not found"), 404

        name = data.get('name')
        foto = data.get('foto')

        # Check if a category with the same name already exists (excluding the current category)
        if Kategori.query.filter(Kategori.id != id, Kategori.name == name).first():
            return response.error([], f"Category with name '{name}' already exists"), 400

        if name:
            kategori.name = name
        if foto:
            kategori.foto = foto

        db.session.commit()

        return response.success(singleObject(kategori), "Category updated successfully"), 200
    except Exception as e:
        return response.error([], str(e)), 500

def delete(id):
    try:
        kategori = Kategori.query.get(id)
        if not kategori:
            return response.error([], "Category not found"), 404

        db.session.delete(kategori)
        db.session.commit()
        return response.success([], "Category deleted successfully"), 200
    except Exception as e:
        return response.error([], str(e)), 500

def formatarray(datas):
    array = []
    for data in datas:
        array.append(singleObject(data))
    return array
        
def singleObject(kategori):
    return {
        'id': kategori.id,
        'name': kategori.name,
        'foto': kategori.foto,
    }
