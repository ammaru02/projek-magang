# app/controller/BannerController.py

from app.model.banner import Banner
from app import response, db
from flask import request, jsonify

def formatarray(datas):
    array = []
    for banner in datas:
        array.append(singleObject(banner))
    return array

def singleObject(banner):
    return {
        'id': banner.id,
        'url_gambar': banner.url_gambar
    }

def index():
    try:
        banners = Banner.query.order_by(Banner.id.desc()).all()
        data = formatarray(banners)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def create():
    try:
        data = request.form
        print("Received form data:", data)
        if 'url_gambar' not in data:
            return jsonify({'message': 'Missing url_gambar field in form data'}), 400
        
        new_banner = Banner(url_gambar=data['url_gambar'])
        db.session.add(new_banner)
        db.session.commit()
        
        return jsonify({'message': 'Banner created successfully', 'banner_id': new_banner.id}), 201
    except Exception as e:
        print("Error creating banner:", str(e))
        return jsonify({'message': str(e)}), 500

def detail(id):
    try:
        banner = Banner.query.filter_by(id=id).first()
        if not banner:
            return response.notFound([], 'Data banner tidak ditemukan')

        data = singleObject(banner)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def update(id):
    try:
        banner = Banner.query.get(id)
        if not banner:
            return jsonify({'message': 'Banner not found'}), 404

        data = request.get_json()
        if 'url_gambar' in data:
            banner.url_gambar = data['url_gambar']

        db.session.commit()
        return jsonify({
            'id': banner.id,
            'url_gambar': banner.url_gambar,
            'message': 'Banner updated successfully'
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def delete(id):
    try:
        banner = Banner.query.filter_by(id=id).first()
        if not banner:
            return response.notFound([], 'Data banner tidak ditemukan')

        db.session.delete(banner)
        db.session.commit()

        return response.success([], "Banner deleted successfully")
    except Exception as e:
        return response.error([], str(e))
