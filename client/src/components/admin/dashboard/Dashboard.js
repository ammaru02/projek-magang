import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [produkCount, setProdukCount] = useState(0);
    const [KeunggulanCount, setKeunggulanCount] = useState(0);
    const [dataArtikelCount, setDataArtikelCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const produkResponse = await fetch('http://127.0.0.1:5000/produk');
const produkData = await produkResponse.json();
if (produkData.length) {
    setProdukCount(produkData.length);
}

            const responKeunggulan = await fetch('http://127.0.0.1:5000/keunggulan');
            const keunggulanData = await responKeunggulan.json();
            if (keunggulanData && keunggulanData.data) {
                setKeunggulanCount(keunggulanData.data.length);
            }

            const artikelRespon = await fetch('http://127.0.0.1:5000/artikel');
            const artikelData = await artikelRespon.json();
            if (artikelData.length) {
                setDataArtikelCount(artikelData.length);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className='dashboard-container'>
            <div className='dashboard-title'>
                <h1>Dashboard</h1>
            </div>
            <div className="card-container">
                <div className="card">
                    <h2 className="title-card">Data Produk Desa</h2>
                    <p className="data-card">{produkCount}</p>
                </div>
                <div className="card">
                    <h2 className="title-card">Kunggulan Desa</h2>
                    <p className="data-card">{KeunggulanCount}</p>
                </div>
                <div className="card">
                    <h2 className="title-card">Data Artikel</h2>
                    <p className="data-card">{dataArtikelCount}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;