import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
        <div>
            <img src={produk.image} alt={produk.name} />
            <h2>{produk.name}</h2>
            <p>Rp {produk.harga}</p>
            <p>{produk.deskripsi}</p>
            <a href={`https://wa.me/${warga.wa}`} target="_blank" rel="noopener noreferrer">
                <button>Hubungi Kami</button>
            </a>
        </div>
    );
}

export default ProdukDetail;