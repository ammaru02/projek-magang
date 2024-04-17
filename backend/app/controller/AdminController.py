# app/controller/adminController.py

from app.model.admin import Admin
from app import response

def index():
    try:
        admin = Admin.query.all()
        data = formatarray(admin)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(admin):
    admin = {
        'id' : admin.id,
        'name' : admin.name,
        'username' : admin.username,
        'email' : admin.email,
        'password' : admin.password,
        'level' : admin.level
    }
    return admin
