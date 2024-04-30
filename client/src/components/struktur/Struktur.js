import React, { useState, useEffect } from 'react';
import './Struktur.css';

function Struktur() {
    const [strukturData, setStrukturData] = useState([]);

    // Mengambil data dari pangkalan data
    useEffect(() => {
        fetch('http://localhost:5000/struktur') // Gantikan '/api/struktur' dengan URL API sebenar anda
            .then(response => response.json())
            .then(data => setStrukturData(data.data)) // Gunakan data.data untuk mendapatkan array sebenar
            .catch(error => console.error('Error fetching data:', error)); // Periksa jika terdapat kesalahan semasa mengambil data
    }, []);

    // Periksa jika strukturData adalah null atau bukan array sebelum menggunakan map
    if (!Array.isArray(strukturData)) {
        console.error('Invalid data format:', strukturData);
        return null; // Return early jika data tidak dalam format yang dijangkakan
    }

    return (
        <>
            <div className='card-struktur'>
                <h1 className='struktur-judul'>STRUKTUR DESA</h1>
                <div className='container'>
                    {strukturData.map((item, index) => (
                        <div key={index} className='card'>
                            <img src={item.foto} alt={item.name} className='card-image' />
                            <div className='card-title'>
                                <h4>{item.name}</h4>
                                <p>{item.jabatan}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Struktur;
