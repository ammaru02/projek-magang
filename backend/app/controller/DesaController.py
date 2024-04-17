# app/controller/DesaController.py

from app.model.desa import Desa
from app import response

def index():
    try:
        desa = Desa.query.all()
        data = formatarray(desa)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(desa):
    desa = {
        'id' : desa.id,
        'name' : desa.name,
        'logo' : desa.logo
    }
    return desa
