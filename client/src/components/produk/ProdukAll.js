import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import './ProdukAll.css'; // import CSS

const ProdukAll = () => {
    const [produk, setProduk] = useState([]);
    const location = useLocation();

useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kategoriId = params.get('kategoriId'); // gunakan 'kategoriId' bukan 'kategori_id'

    const apiUrl = kategoriId 
        ? `http://localhost:5000/produk?kategoriId=${kategoriId}` 
        : `http://localhost:5000/produk`;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        setProduk(data.data); // gunakan data.data bukan hanya data
    })
    .catch(error => console.error('Error:', error));
}, [location]);

    return (
        <div className="card-container">
            <div className="page-all-produk">
                <i className="fa-solid fa-house"><p className="teks-icon">/ PRODUK DESA</p></i>
                <h2 className="title-produk">PRODUK DESA KASSI</h2>
            </div>
            {produk.map((item, index) => (
                <div key={index} className="card">
                    <img src={item.image} alt={item.name} className="card-image" />
                    <h2 className="card-title">{item.name}</h2>
                    <Link to={`/produkdetail/${item.id}`}>
                        <button className="detail-button">Detail</button>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default ProdukAll;
