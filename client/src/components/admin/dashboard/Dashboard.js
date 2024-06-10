import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [produkCount, setProdukCount] = useState(0);
    const [KeunggulanCount, setKeunggulanCount] = useState(0);
    const [dataArtikelCount, setDataArtikelCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                navigate('/login');
                return;
            }

            const [produkResponse, keunggulanResponse, artikelRespon] = await Promise.all([
                axios.get('http://127.0.0.1:5000/produk', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://127.0.0.1:5000/keunggulan', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://127.0.0.1:5000/artikel', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const produkData = produkResponse.data;
            if (produkData.length) {
                setProdukCount(produkData.length);
            }

            const keunggulanData = keunggulanResponse.data;
            if (keunggulanData && keunggulanData.data) {
                setKeunggulanCount(keunggulanData.data.length);
            }

            const artikelData = artikelRespon.data;
            if (artikelData.length) {
                setDataArtikelCount(artikelData.length);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
                    <h2 className="title-card">Keunggulan Desa</h2>
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
