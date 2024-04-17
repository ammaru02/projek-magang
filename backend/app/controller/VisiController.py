from app.model.visi import Visi
from app import response

def index():
    try:
        visi = Visi.query.all()
        data = formatarray(visi)
        return response.success(data, "success")
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
    }
    return visi
