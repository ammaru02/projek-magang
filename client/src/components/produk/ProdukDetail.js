import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./ProdukDetail.css"

function ProdukDetail() {
    const { id } = useParams();
    const [produk, setProduk] = useState({});
    const [warga, setWarga] = useState({});
    const [contactMethod, setContactMethod] = useState('whatsapp'); // State untuk pilihan hubungi kami

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

    const handleContactMethodChange = (event) => {
        setContactMethod(event.target.value);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    if (!produk) {
        return <div>Loading...</div>;
    }

    let contactLink = '';
    if (contactMethod === 'whatsapp') {
        contactLink = `https://wa.me/${warga.wa}`;
    } else if (contactMethod === 'email') {
        // Ganti dengan link email yang sesuai
        contactLink = `mailto:${warga.email}`;
    }

    return (
        <div className='container-sm'>
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
                    <p>{formatPrice(produk.harga)}</p>
                    <p>{produk.deskripsi}</p>
                </div>
                <div className='contact-options'>
                    <label>
                        <input type="radio" value="whatsapp" checked={contactMethod === 'whatsapp'} onChange={handleContactMethodChange} />
                        WhatsApp
                    </label>
                    <label>
                        <input type="radio" value="email" checked={contactMethod === 'email'} onChange={handleContactMethodChange} />
                        Email
                    </label>
                </div>
                <a href={contactLink} target="_blank" rel="noopener noreferrer">
                    <button className='btn-detail'>Hubungi Kami</button>
                </a>
            </div>
        </div>
    );
}

export default ProdukDetail;
