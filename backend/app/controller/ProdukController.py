from app.model.produk import Produk
from app import response

def index():
    try:
        produk = Produk.query.all()
        data = formatarray(produk)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(produk):
    produk = {
        'id' : produk.id,
        'name' : produk.name,
        'harga' : produk.harga,
        'deskripsi' : produk.deskripsi,
        'desa_id' : produk.desa_id,
        'warga_id' : produk.warga_id,
        'kategori_id' : produk.kategori_id,
    }
    return produk
