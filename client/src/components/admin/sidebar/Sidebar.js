import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa'; // tambahkan FaBars di sini
import { Button } from 'react-bootstrap';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="sidebar">
            <h2>Admin</h2>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/produk-desa">Produk Desa</Link></li>
                <li><Link to="/visi-misi">Visi Misi</Link></li>
                <li><Link to="/akun">Akun</Link></li>
            </ul>
            <button className="logout-btn"><FaSignOutAlt /></button>
        </div>
    );
};

export default Sidebar;
