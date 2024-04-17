from app.model.kategori import Kategori
from app import response

def index():
    try:
        kategori = Kategori.query.all()
        data = formatarray(kategori)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(kategori):
    kategori = {
        'id' : kategori.id,
        'name' : kategori.name,
    }
    return kategori
