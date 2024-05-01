import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-container'>
        <div className='row'>
          {/* Column 1 */}
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
          {/* Column 2 */}
          <div className='col'>
            <ul className='footer-list'>
              <li>
                <Link to='/produkdesa'>
                  <h2>Produk Desa</h2>
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 3 */}
          <div className='col'>
            <div className='contact'>
              <h2>Kontak Kami</h2>
              <p>Jl.Poros Majene No.16 Desa Lapeo</p>
              <p>Kecamatan Campalagian Kabupaten</p>
              <p>Polewali Mandar Provinsi Sulawesi Barat</p>
              <p>Kode Pos 91353</p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='copyright'>
        <p className='col-sm'>
          COPYRIGHT &copy; KASSI 2024
        </p>
      </div>
    </div>
  )
}

export default Footer;
