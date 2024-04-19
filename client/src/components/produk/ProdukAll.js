// ProdukAll.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import './ProdukAll.css';
import image1 from '../image/produk1.jpg';
import image2 from '../image/produk2.jpg';
import image3 from '../image/produk3.jpg';
import image4 from '../image/produk4.jpg';
import image5 from '../image/produk5.jpg';

const DataProduk = [
    {
        "Image": image1,
        "Title": "Kripik Singkong",
        "Category": "Makanan"
    },
    {
        "Image": image2,
        "Title": "Pisang Lumpur",
        "Category": "Minuman"
    },
    {
        "Image": image3,
        "Title": "Topi Rajut",
        "Category": "Kerajinan Tangan"
    },
    {
        "Image": image4,
        "Title": "Kol",
        "Category": "Sayuran & Buah"
    },
    {
        "Image": image5,
        "Title": "Tomat",
        "Category": "Sayuran & Buah"
    },
];

const ProdukAll = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const selectedCategory = searchParams.get('category');

    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (selectedCategory) {
            const filtered = DataProduk.filter(item => item.Category === selectedCategory);
            setFilteredData(filtered);
        } else {
            setFilteredData(DataProduk);
        }
    }, [selectedCategory]);

    return (
        <div className="container">
            <div className="page-produk-all">
                <i className="fa-solid fa-house"><p className="teks-icon">/ PRODUK DESA</p></i>
                <h2 className="title-produkall">PRODUK DESA KASSI</h2>
            </div>
            <div className="card-produkall">
                {filteredData.map((item, index) => (
                    <div key={index} className='card'>
                        <div className='card-title'>
                            <h4>{item.Title}</h4>
                        </div>
                        <img src={item.Image} alt={item.Title} className='card-image' />
                        <Link to="/detail">
                            <button>Detail</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProdukAll;
