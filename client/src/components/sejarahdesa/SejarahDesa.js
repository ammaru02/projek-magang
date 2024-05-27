import React, { useState, useEffect } from "react";
import './SejarahDesa.css';

const SejarahDesa = () => {
    const [sejarah, setSejarah] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/sejarah')
            .then(response => response.json())
            .then(data => setSejarah(data))
            .catch(error => console.error('Error fetching sejarah:', error));
    }, []);

    return (
        <div className="container-sm">
            <div className="page-sejarah">
                <i className="fas fa-home"><p className="teks-icon">/ SEJARAH DESA</p></i>
                <h2 className="title-sejarah">SEJARAH DESA KASSI</h2>
            </div>
            {sejarah.length > 0 && <img src={sejarah[0].foto} alt="sejarah" className="image-sejarah" />}
            {sejarah.map((item, index) => (
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
    );
}

export default SejarahDesa;
