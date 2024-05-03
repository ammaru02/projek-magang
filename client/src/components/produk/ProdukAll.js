import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import './ProdukAll.css'; // import CSS

const ProdukAll = () => {
    const [produk, setProduk] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const kategoriId = params.get('kategoriId');
        const storage = getStorage();
        const storageRef = ref(storage, 'images/produk/');
        const apiUrl = kategoriId 
            ? `http://localhost:5000/produk?kategoriId=${kategoriId}` 
            : `http://localhost:5000/produk`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Mengurutkan data produk sesuai abjad berdasarkan nama
                    const sortedProduk = data.sort((a, b) => a.name.localeCompare(b.name));
                    setProduk(sortedProduk);
                } else if (data && data.data && Array.isArray(data.data)) {
                    // Jika response memiliki format data.data, juga mengurutkan sesuai abjad
                    const sortedProduk = data.data.sort((a, b) => a.name.localeCompare(b.name));
                    setProduk(sortedProduk);
                } else {
                    console.error('Unexpected data format:', data);
                    setProduk([]);
                }
            })
            .catch(error => console.error('Error:', error));

        listAll(storageRef)
            .then((res) => {
                const urls = res.items.map((itemRef) => getDownloadURL(itemRef));
                Promise.all(urls)
                    .then((downloadURLs) => {
                        setImageUrls(downloadURLs);
                    })
                    .catch((error) => {
                        console.error("Error fetching download URLs:", error);
                    });
            })
            .catch((error) => {
                console.error("Error listing items in storage:", error);
            });
    }, [location]);

    return (
        <div className="container-sm">
            <div className="page-all-produk">
                <i className="fa-solid fa-house"><p className="teks-icon">/ PRODUK DESA</p></i>
                <h2 className="title-produk">PRODUK DESA KASSI</h2>
            </div>
            <div className="card-produk">
                {produk.map((item, index) => (
                    <div key={index} className="produk-card">
                        {imageUrls.map((url, idx) => {
                            if (url.endsWith(item.foto)) {
                                return <img key={idx} src={url} alt={item.name} className="card-images" />;
                            }
                            return null;
                        })}
                        <h4 className="card-title-produkall">{item.name}</h4>
                        <Link to={`/produkdetail/${item.id}`}>
                            <button className="detail-button">Detail</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProdukAll;
