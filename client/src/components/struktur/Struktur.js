import React, { useState, useEffect } from "react";
import './Struktur.css';

const Struktu = () => {
    const [strukturImage, setStrukturImage] = useState(""); // State untuk menyimpan URL gambar

    useEffect(() => {
        fetch('http://localhost:5000/visi') 
            .then(response => response.json())
            .then(data => {
                console.log('Data Visi:', data);
                if (Array.isArray(data) && data.length > 0) {
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
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);    

    return (
        <div className="container-sm">
            <div className="page-struktur">
            <h1 className='struktur-judul'>STRUKTUR DESA</h1>
                {strukturImage && <img src={strukturImage} alt="struktur" className="image-struktur"/>}
            </div>
        </div>
    );
}

export default Struktu;
