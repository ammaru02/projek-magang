import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './KategoriProduk.css';
import image1 from '../image/produk1.jpg';
import image2 from '../image/produk2.jpg';
import image3 from '../image/produk3.jpg';
import image4 from '../image/produk4.jpg';

const KategoriProduk = () => {
    const [kategori, setKategori] = useState([]);

    useEffect(() => {
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
            .catch(error => console.error('Error:', error)); // tambahkan penanganan error
    }, []);

    const handleShowClick = (kategoriId) => {
        // Mengarahkan pengguna ke halaman ProdukAll dengan menyertakan parameter kategoriId
        window.location.href = `/produk?kategoriId=${kategoriId}`;
    };

    return (
        <div className="container">
            <div className="page-kategori-produk">
                <i className="fa-solid fa-house"><p className="teks-icon">/ PRODUK DESA</p></i>
                <h2 className="title-kategori">PRODUK DESA KASSI</h2>
            </div>
            <div className="card-kategori">
                {kategori.map((item, index) => (
                    <div key={index} className='card'>
                        <div className='card-title'>
                            <h4>{item.name}</h4>
                        </div>
                        <img src={index === 0 ? image1 : index === 1 ? image2 : index === 2 ? image3 : image4} alt={item.name} className='card-image' />
                        {/* Menyertakan id kategori saat tombol "Show" diklik */}
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
