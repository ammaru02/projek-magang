import React, { useState } from "react";
import './ProdukAll.css'
import image1 from '../image/produk1.jpg'
import image2 from '../image/produk2.jpg'
import image3 from '../image/produk3.jpg'
import image4 from '../image/produk4.jpg'
import image5 from '../image/produk5.jpg'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const DataImage = [
    {
        "Image": image1,
        "Title": "Kripik Singkong"
    },
    {
        "Image": image2,
        "Title": "Pisang Lumpur"
    },
    {
        "Image": image3,
        "Title": "Topi Rajut"
    },
    {
        "Image": image4,
        "Title": "Kol"
    },
    {
        "Image": image5,
        "Title": "Tomat"
    }, 
]

const ProdukAll = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <>
        <div className="container">
            <div className="page-produk-all">
                <i className="fa-solid fa-house"><p className="teks-icon">/ PRODUK DESA</p></i>
                <h2 className="title-produkall">PRODUK DESA KASSI</h2>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
            
            <div className="card-produkall">
                {DataImage.filter((item) => {
                    if (searchTerm === "") {
                        return item;
                    } else if (item.Title.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return item;
                    }
                    return null;
                }).map((item, index) => (
                    <div key={index} className='card'>
                        <div className='card-title'>
                            <h4>{item.Title}</h4>
                        </div>
                        <img src={item.Image} alt={item.Title} className='card-image' />
                        <Link to='/detail'>
                            <button>Detail</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}

export default ProdukAll;
