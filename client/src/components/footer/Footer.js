import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
    <div className='container'>
        <div className='row'>
            {/* Colom 1 */}
            <div className='col'>
                <ul className='footer-list'>
                    <li>
                    <Link to='/profildesa'>
                        <h2>Profil Desa</h2>
                    </Link>
                    </li>
                    <li>
                    <Link to='/visimisi'>
                        <h4>Visi Misi & Struktur Desa</h4>
                    </Link>
                    </li>
                    <li>
                    <Link to='/sejarah'>
                        <h4>Sejarah Desa</h4>
                    </Link>
                    </li>
                    <li>
                    <Link to='/keunggulan'>
                        <h4>Keunggulan Desa</h4>
                    </Link>
                    </li>
                </ul>
            </div>
        </div>
            {/* Colom 2 */}
        <div className='row'>
            <div className='col'>
                <ul className='footer-list'>
                    <li>
                    <Link to='/produkdesa'>
                        <h2>Produk Desa</h2>
                    </Link>
                    </li>
                </ul>
            </div>
        </div>    
            {/* Colom 3 */}
        <div className='row'>
            <div className='col'>
                <h2>Kontak Kami</h2>
                <p>Jl.Poros Majene No.16 Desa Lapeo</p>
                <p>Kecamatan</p>
            </div>
        </div>
    </div>
    <hr/>
        <div className='copyright'>
            <p className='col-sm'>
                COPYRIGHT &copy; KASSI 2024
            </p>
        </div>
    </div>
  )
}

export default Footer


