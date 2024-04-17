from app.model.banner import Banner
from app import response, db

def index():
    try:
        banners = Banner.query.all()
        data = formatarray(banners)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))

def formatarray(datas):
    array = []
    for banner in datas:
        array.append(singleObject(banner))
    return array
        
def singleObject(banner):
    return {
        'id' : banner.id,
        'gambar' : banner.gambar,
        'url_gambar' : banner.url_gambar
    }

def detail(gambar):
    try:
        banner = Banner.query.filter_by(gambar=gambar).first()
        if not banner:
            return response.notFound([], 'Data banner tidak ditemukan')
        
        data = singleObject(banner)
        return response.success(data, "success")
    except Exception as e:
        return response.error([], str(e))
    
class BannerController:
    # Existing code...

    @staticmethod
    def create(data):
        try:
            new_banner = Banner(url_gambar=data['url_gambar'])
            db.session.add(new_banner)
            db.session.commit()
            return response.success(singleObject(new_banner), "Banner created successfully")
        except Exception as e:
            return response.error([], str(e))

    @staticmethod
    def detail(gambar):
        try:
            banner = Banner.query.filter_by(gambar=gambar).first()
            if not banner:
                return response.notFound([], 'Data banner tidak ditemukan')
            
            data = singleObject(banner)
            return response.success(data, "success")
        except Exception as e:
            return response.error([], str(e))
    # Existing code...

    @staticmethod
    def create(data):
        try:
            new_banner = Banner(url_gambar=data['url_gambar'])
            db.session.add(new_banner)
            db.session.commit()
            return response.success(singleObject(new_banner), "Banner created successfully")
        except Exception as e:
            return response.error([], str(e))

    @staticmethod
    def detail(gambar):
        try:
            banner = Banner.query.filter_by(gambar=gambar).first()
            if not banner:
                return response.notFound([], 'Data banner tidak ditemukan')
            
            data = singleObject(banner)
            return response.success(data, "success")
        except Exception as e:
            return response.error([], str(e))