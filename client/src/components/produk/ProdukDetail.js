import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./ProdukDetail.css"

function ProdukDetail() {
    const { id } = useParams();
    const [produk, setProduk] = useState({});
    const [warga, setWarga] = useState({});

    useEffect(() => {
        fetch(`http://localhost:5000/produk/${id}`)
            .then(response => response.json())
            .then(data => {
                setProduk(data);
                return fetch(`http://localhost:5000/warga/${data.warga_id}`);
            })
            .then(response => response.json())
            .then(data => setWarga(data));
    }, [id]);

    if (!produk) {
        return <div>Loading...</div>;
    }

    return (
        
        <div className='page-detail'>
            <div className="judul-detail">
                <i className="fa-solid fa-house"><p className="teks-icon">/ PRODUK DESA</p></i>
                <h2 className="title-detail">PRODUK DESA KASSI</h2>
            </div>
            <div className='detail-image'>
                <img src={produk.foto} alt={produk.name}  width="400px" />
            </div>
            <div className='detail-teks'>
                <h2>{produk.name}</h2>
                <p>Rp {produk.harga}</p>
                <p>{produk.deskripsi}</p>
            </div>
            <a href={`https://wa.me/${warga.wa}`} target="_blank" rel="noopener noreferrer">
                <button className='btn-detail'>Hubungi Kami</button>
            </a>
        </div>
    );
}

export default ProdukDetail;