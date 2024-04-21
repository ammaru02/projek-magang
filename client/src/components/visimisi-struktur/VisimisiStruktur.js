import React, { useState, useEffect } from "react";
import './VisimisiStruktur.css'
import image1 from '../image/Banner1.jpeg'

const VisimisiStruktu = () => {
    const [visi, setVisi] = useState("");
    const [misi, setMisi] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/visi') // ganti dengan URL API backend Flask Anda
            .then(response => response.json())
            .then(data => {
                console.log('Data:', data);
                if (data.data && data.data.length > 0) {
                    setVisi(data.data[0].visi); // simpan visi ke dalam state
                }
            })
            .catch(error => console.error('Error:', error)); // tambahkan penanganan error
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/misi') // ganti dengan URL API backend Flask Anda
            .then(response => response.json())
            .then(data => {
                console.log('Data:', data);
                if (data.data && data.data.length > 0) {
                    setMisi(data.data); // simpan misi ke dalam state
                }
            })
            .catch(error => console.error('Error:', error)); // tambahkan penanganan error
    }, []);

    return (
        <>
            <div className="container">
                <div className="page-visimisi">
                    <i className="fa-solid fa-house"><p className="teks-icon">/ Visi Misi & Struktur Desa</p></i>
                    <h2 className="title-visimisi">VISI MISI DESA KASSI</h2>
                </div>
                <div className="visimisi-isi">
                    <h3>Visi</h3>
                    <p className="deskripsi-visimisi">
                        {visi}
                    </p>
                </div>
                <div className="visimisi-isi">
                    <h3>Misi</h3>
                    <ol className="list-misi">
                        {misi.map((item, index) => (
                            <li key={index}><p>{item.misi}</p></li>
                        ))}
                    </ol>
                </div>
                <div className="page-struktur">
                    <h2 className="title-struktur">STRUKTUR DESA KASSI</h2>
                    <img src={image1} alt="struktur" className="image-struktur"/>
                </div>
            </div>
        </>
    )
}

export default VisimisiStruktu;