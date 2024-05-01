import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import './KategoriProduk.css';


const KategoriProduk = () => {
    const [kategori, setKategori] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const storage = getStorage();
        const storageRef = ref(storage, 'images/kategori/');
        fetch('http://localhost:5000/kategori')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data:', data);
                if (data.data && data.data.length > 0) {
                    setKategori(data.data); // simpan kategori ke dalam state
                }
            })
            listAll(storageRef)
        .then((res) => {
            let promises = res.items.map((item) => getDownloadURL(item));
            Promise.all(promises)
                .then((urls) => setImageUrls(urls))
                .catch((error) => console.log(error));
        })
            .catch(error => console.error('Error:', error)); // tambahkan penanganan error
    }, []);

    const handleShowClick = (kategoriId) => {
        // Mengarahkan pengguna ke halaman ProdukAll dengan menyertakan parameter kategoriId
        window.location.href = `/produk?kategoriId=${kategoriId}`;
    };

    return (
        <div className="container-sm">
            <div className="page-kategori-produk">
                <i className="fa-solid fa-house"><p className="teks-icon">/ PRODUK DESA</p></i>
                <h2 className="title-kategori">PRODUK DESA KASSI</h2>
            </div>
            <div className="card-kategori">
                {kategori.map((item, index) => (
                    <div key={index} className='kategori-card'>
                        <div className='card-title-produk'>
                            <h4>{item.name}</h4>
                        </div>
                        {imageUrls.map((url, index) => {
                         if(url.endsWith(item.foto)) {
                            return <img key={index} src={url} alt={item.name} className="card-image" />;
                        }
                         return null;
                         })}
                        <Link to={`/produk?kategoriId=${encodeURIComponent(item.id)}`}>
                            <button>Show</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KategoriProduk;
