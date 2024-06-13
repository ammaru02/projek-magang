import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Dropdown from './Dropdown';
import gambar from '../image/logo.png';

function Navbar() {
    const [click, setClick] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const updateMedia = () => {
            setIsMobile(window.innerWidth < 960);
        };
        updateMedia();
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const handleDropdownClick = () => {
        setDropdown(!dropdown);
    };

    return (
        <>
            <nav className='navbar'>
                <Link to='/' className='navbar-logo'>
                    <img src={gambar} alt='logo' className='logo' />
                    <h1 className='logo-text'>DESA KASSI KABUPATEN JENEPONTO</h1>
                </Link>
                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li
                        className='nav-item'
                        ref={dropdownRef}
                        onClick={handleDropdownClick}
                    >
                        {/* <Link to='/profildesa' className='nav-links' onClick={closeMobileMenu}>  */}
                            Profil Desa <i className='fas fa-caret-down' />
                        {/* </Link> */}
                        {dropdown && <Dropdown />}
                    </li>
                    <li className='nav-item'>
                        <Link to='/produkdesa' className='nav-links' onClick={closeMobileMenu}>
                            Produk Desa
                        </Link>
                    </li>
                    {isMobile && (
                        <li className='nav-item'>
                            <Link to='/visimisi' className='nav-links' onClick={closeMobileMenu}>
                                Visi Misi & Struktur Desa
                            </Link>
                        </li>
                    )}
                    {isMobile && (
                        <li className='nav-item'>
                            <Link to='/sejarah' className='nav-links' onClick={closeMobileMenu}>
                                Sejarah Desa
                            </Link>
                        </li>
                    )}
                    {isMobile && (
                        <li className='nav-item'>
                            <Link to='/keunggulan' className='nav-links' onClick={closeMobileMenu}>
                                Keunggulan Desa
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </>
    );
}

export default Navbar;
