import React from 'react';
import './Struktur.css';
import image1 from '../image/Banner1.jpeg';
import image2 from '../image/Banner2.jpg';
import image3 from '../image/Banner3.jpg';
import image4 from '../image/Banner4.jpg';

const DataImage = [
    {
        "Image": image1,
        "Title": "Gambar1"
    },
    {
        "Image": image2,
        "Title": "Gambar2"
    },
    {
        "Image": image3,
        "Title": "Gambar3"
    },
    {
        "Image": image4,
        "Title": "Gambar4"
    },
    {
        "Image": image2,
        "Title": "Gambar4"
    }
];

function Struktur() {
    // Menyusun item menjadi array dengan setiap array berisi 5 item
    const rows = [];
    for (let i = 0; i < DataImage.length; i += 5) {
        rows.push(DataImage.slice(i, i + 5));
    }

    return (
        <>
            <div className='card-struktur'>
                <h1 className='struktur-judul'>STRUKTUR DESA</h1>
                <div className='container'>
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className='row'>
                            {row.map((item, index) => (
                                <div key={index} className='card'>
                                    <img src={item.Image} alt={item.Title} className='card-image' />
                                    <div className='card-title'>
                                        <h4>{item.Title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Struktur;
