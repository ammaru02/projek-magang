from app.model.misi import Misi
from app import response

def index():
    try:
        misi = Misi.query.all()
        data = formatarray(misi)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(misi):
    misi = {
        'id' : misi.id,
        'misi' : misi.misi,
        'visiId' : misi.visiId
    }
    return misi