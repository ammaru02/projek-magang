import React, { useState, useEffect } from "react";
import './SejarahDesa.css';
import image1 from '../image/Banner1.jpeg';

const SejarahDesa = () => {
    const [sejarah, setSejarah] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/sejarah') // ganti dengan URL API backend Flask Anda
            .then(response => response.json())
            .then(data => setSejarah(data.data)); // simpan semua data ke dalam state sejarah
    }, []);

    return (
        <>
            <div className="container-sm">
                <div className="page-sejarah">
                    <i className="fa-solid fa-house"><p className="teks-icon">/ SEJARAH DESA</p></i>
                    <h2 className="title-sejarah">SEJARAH DESA KASSI</h2>
            </div>
            <img src={image1} alt="sejarah" className="image-sejarah"/>
            {sejarah.map((item, index) => ( // gunakan fungsi map untuk menampilkan semua data sejarah
                <div className="sejarah-isi" key={index}>
                    <p className="sejarah-deskripsi">{item.deskripsi}</p>
                    {index === 0 && (
                        <ul className="list-sejarah" style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            <li>Sebelah Utara berbatasan dengan Desa Loka</li>
                            <li>Sebelah Selatan berbatasan dengan Desa Pallantikang</li>
                            <li>Sebelah Timur berbatasan dengan Kabupaten Bantaeng</li>
                            <li>Sebelah Barat berbatasan dengan Desa Bonto Tiro</li>
                        </ul>
                    )}
                </div>
            ))}
            </div>
                    </>
                );
            }

export default SejarahDesa;