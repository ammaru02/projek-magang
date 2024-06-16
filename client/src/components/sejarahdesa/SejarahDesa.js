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
                    <div 
                        className="sejarah-deskripsi" 
                        dangerouslySetInnerHTML={{ __html: item.deskripsi }} 
                    />
                </div>
            ))}
        </div>
    );
}

export default SejarahDesa;
