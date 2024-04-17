from app.model.struktur import Struktur
from app import response

def index():
    try:
        struktur = Struktur.query.all()
        data = formatarray(struktur)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(struktur):
    struktur = {
        'id' : struktur.id,
        'name' : struktur.name,
        'foto' : struktur.foto,
        'jabatan' : struktur.jabatan,
        'desaId' : struktur.desaId,
    }
    return struktur
