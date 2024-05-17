import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [produkCount, setProdukCount] = useState(0);
    const [strukturDesaCount, setStrukturDesaCount] = useState(0);
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

            const strukturDesaResponse = await fetch('http://127.0.0.1:5000/struktur');
            const strukturDesaData = await strukturDesaResponse.json();
            if (strukturDesaData && strukturDesaData.data) {
                setStrukturDesaCount(strukturDesaData.data.length);
            }

            const dataArtikelResponse = await fetch('http://127.0.0.1:5000/artikel');
            const dataArtikelData = await dataArtikelResponse.json();
            if (dataArtikelData && dataArtikelData.data) {
                setDataArtikelCount(dataArtikelData.data.length);
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
                    <h2 className="title-card">Struktur Desa</h2>
                    <p className="data-card">{strukturDesaCount}</p>
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