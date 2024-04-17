from app.model.sejarah import Sejarah
from app import response

def index():
    try:
        sejarah = Sejarah.query.all()
        data = formatarray(sejarah)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(sejarah):
    sejarah = {
        'id' : sejarah.id,
        'name' : sejarah.name,
        'foto' : sejarah.foto,
        'deskripsi' : sejarah.deskripsi,
        'desaId' : sejarah.desaId,
    }
    return sejarah
