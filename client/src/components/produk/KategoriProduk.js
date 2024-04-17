import React from "react";
import './KategoriProduk.css'
import image1 from '../image/produk1.jpg'
import image2 from '../image/produk2.jpg'
import image3 from '../image/produk3.jpg'
import image4 from '../image/produk4.jpg'
import { Link } from "react-router-dom";

const DataImage = [
    {
        "Image": image1,
        "Title": "Makanan"
    },
    {
        "Image": image2,
        "Title": "Minuman"
    },
    {
        "Image": image3,
        "Title": "Kerajinan Tangan"
    },
    {
        "Image": image4,
        "Title": "Sayuran & Buah"
    },
 
]


const KategoriProduk = ()=>{
    return(
        <>
        <div className="container">
            <div className="page-kategori-produk">
                <i class="fa-solid fa-house"><p className="teks-icon">/ PRODUK DESA</p></i>
                <h2 className="title-kategori">PRODUK DESA KASSI</h2>
            </div>
            <div className="card-kategori">
                {DataImage.map((item, index) => (
                <div key={index} className='card'>
                <div className='card-title'>
                <h4>{item.Title}</h4>
                </div>
                <img src={item.Image} alt={item.Title} className='card-image' />
                <Link to='/produk'>
                    <button>Show</button>
                </Link>
                </div>
                ))}
            </div>
        </div>
        </>
    )
}

export default KategoriProduk;