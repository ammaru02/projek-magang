import React, { useState } from 'react';
import "./Sidebar.css";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // Initialize navigate hook

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    }

    const handleItemClick = () => {
        if (window.innerWidth <= 768) {
            setIsOpen(false); // Menutup sidebar saat item menu diklik di ukuran layar mobile
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token'); // Hapus token dari localStorage
        navigate('/login'); // Arahkan pengguna ke halaman login
    }

    return (
        <div>
            <div className={`sidebarAdmin ${isOpen ? 'open' : ''}`}>
                <div className='sidebarWrapper'>
                    <div className='sidebarMenu'>
                        <h3 className='sidebarTitle'>Admin</h3>
                        <ul className='sidebarList'>
                            <li>
                                <Link to='/homeadmin' className='sidebarListItem active' onClick={handleItemClick}>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to='/profildesaadmin' className='sidebarListItem' onClick={handleItemClick}>
                                    Profil Desa
                                </Link>
                            </li>
                            <li>
                                <Link to='/produkdesaadmin' className='sidebarListItem' onClick={handleItemClick}>
                                    Produk Desa
                                </Link>
                            </li>
                            <li>
                                <Link to='/artikeladmin' className='sidebarListItem' onClick={handleItemClick}>
                                    Artikel
                                </Link>
                            </li>
                            <li>
                                <Link to='/akunadmin' className='sidebarListItem' onClick={handleItemClick}>
                                    Data Admin
                                </Link>
                            </li>
                        </ul>
                        <div className='sidebarLogout' onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="burger" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </div>
        </div>
    )
}
