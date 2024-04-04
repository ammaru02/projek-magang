/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { Button } from './Button';
import './Navbar.css';
import Dropdown from './Dropdown';
import gambar from '../image/logo.png';




function Navbar(){
    const [click, setClick] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const onMouseEnter = () =>{
        if (window.innerWidth < 960) {
            setDropdown(false)
        }else{
            setDropdown(true)
        }
    };

    const onMouseLeave = () =>{
        if (window.innerWidth < 960) {
            setDropdown(false)
        }else{
            setDropdown(false)
        }
    };
    

    return(
        <>
            <nav className='navbar'>
                <Link to='/' className='navbar-logo'>
                    <img src={gambar} className='logo'/>
                    <h1 className='logo-text'>DESA KASSI KABUPATEN JENEPONTO</h1>
                </Link>
                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu' }>
                    <li className='nav-item'
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        <Link to='/profildesa' className='nav-links' onClick={closeMobileMenu}>
                            Profil Desa <i className='fas fa-caret-down'/>
                        </Link>
                        {dropdown && <Dropdown/>}
                    </li>
                    <li className='nav-item'>
                        <Link to='/produkdesa' className='nav-links' onClick={closeMobileMenu}>
                            Produk Desa
                        </Link>
                    </li>
                    {/* <li className='nav-item'>
                        <Link to='/login' className='nav-links-mobile' onClick={closeMobileMenu}>
                            Login
                        </Link>
                        <Button/>
                    </li> */}
                </ul>
            </nav>
        </>
    )

}

export default Navbar;
