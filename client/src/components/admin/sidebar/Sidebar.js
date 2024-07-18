import React, { useState, useEffect } from 'react';
import "./Sidebar.css";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('/homeadmin'); // State untuk melacak item aktif
    const navigate = useNavigate(); // Initialize navigate hook
    const location = useLocation(); // Initialize location hook

    useEffect(() => {
        setActiveItem(location.pathname); // Set active item berdasarkan URL saat ini
    }, [location]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    }

    const handleItemClick = (path) => {
        setActiveItem(path); // Set item aktif ke path yang diklik
        navigate(path); // Navigasi ke path yang diklik
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
                                <Link 
                                    to='/homeadmin' 
                                    className={`sidebarListItem ${activeItem === '/homeadmin' ? 'active' : ''}`} 
                                    onClick={() => handleItemClick('/homeadmin')}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/banneradmin' 
                                    className={`sidebarListItem ${activeItem === '/banneradmin' ? 'active' : ''}`} 
                                    onClick={() => handleItemClick('/banneradmin')}
                                >
                                    Banner
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/profildesaadmin' 
                                    className={`sidebarListItem ${activeItem === '/profildesaadmin' ? 'active' : ''}`} 
                                    onClick={() => handleItemClick('/profildesaadmin')}
                                >
                                    Profil Desa
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/produkdesaadmin' 
                                    className={`sidebarListItem ${activeItem === '/produkdesaadmin' ? 'active' : ''}`} 
                                    onClick={() => handleItemClick('/produkdesaadmin')}
                                >
                                    Produk Desa
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/artikeladmin' 
                                    className={`sidebarListItem ${activeItem === '/artikeladmin' ? 'active' : ''}`} 
                                    onClick={() => handleItemClick('/artikeladmin')}
                                >
                                    Artikel
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/akunadmin' 
                                    className={`sidebarListItem ${activeItem === '/akunadmin' ? 'active' : ''}`} 
                                    onClick={() => handleItemClick('/akunadmin')}
                                >
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
