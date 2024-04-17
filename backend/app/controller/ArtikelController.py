from app.model.artikel import Artikel
from app import response

def index():
    try:
        artikel = Artikel.query.all()
        data = formatarray(artikel)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

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