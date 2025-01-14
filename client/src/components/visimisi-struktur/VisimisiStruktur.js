import React, { useState, useEffect } from "react";
import './VisimisiStruktur.css';

const VisimisiStruktu = () => {
    const [visi, setVisi] = useState("");
    const [misi, setMisi] = useState([]);
    const [strukturImage, setStrukturImage] = useState(""); // State untuk menyimpan URL gambar

    useEffect(() => {
        fetch('http://localhost:5000/visi') 
            .then(response => response.json())
            .then(data => {
                console.log('Data Visi:', data);
                if (Array.isArray(data) && data.length > 0) {
                    setVisi(data[0].visi);
                    setStrukturImage(data[0].foto); // Ambil URL gambar dari data
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);
    
    useEffect(() => {
        fetch('http://localhost:5000/misi') 
            .then(response => response.json())
            .then(data => {
                console.log('Data Misi:', data);
                if (Array.isArray(data) && data.length > 0) {
                    setMisi(data);
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);    

    return (
        <div className="container-sm">
            <div className="page-visimisi">
                <i className="fa-solid fa-house"><p className="teks-icon">/ Visi Misi & Struktur Desa</p></i>
                <h2 className="title-visimisi">VISI MISI DESA KASSI</h2>
            </div>
            <div className="visimisi-isi">
                <h3>Visi</h3>
                <div 
                    className="deskripsi-visimisi" 
                    dangerouslySetInnerHTML={{ __html: visi }}
                />
            </div>
            <div className="visimisi-isi">
                <h3>Misi</h3>
                <ol className="list-misi">
                    {misi.map((item, index) => (
                        <li key={index}>
                            <div dangerouslySetInnerHTML={{ __html: item.misi }} />
                        </li>
                    ))}
                </ol>
            </div>
            <div className="page-struktur">
                <h2 className="title-struktur">STRUKTUR DESA KASSI</h2>
                {strukturImage && <img src={strukturImage} alt="struktur" className="image-struktur"/>}
            </div>
        </div>
    );
}

export default VisimisiStruktu;
