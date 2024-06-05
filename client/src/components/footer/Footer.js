import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
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
              <p>Garege Desa Kassi</p>
              <p>Kecamatan Rumbia</p>
              <p>Kabupaten Jeneponto</p>
              <p>Kode Pos 92371</p>
            </div>
            <div className='social-icons'>
              <a href='mailto:Kassidesa@gmail.com' aria-label='Email'>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Kassidesa@gmail.com</span>
              </a>
              <a href='https://www.facebook.com/Kassi' target='_blank' rel='noopener noreferrer' aria-label='Facebook Kassi'>
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href='https://www.instagram.com/agrowisatadesakassi/' target='_blank' rel='noopener noreferrer' aria-label='Instagram agrowisatadesakassi'>
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href='https://www.youtube.com/channel/CHANNEL_ID' target='_blank' rel='noopener noreferrer' aria-label='Desa Kassi YouTube Channel'>
                <FontAwesomeIcon icon={faYoutube} />
              </a>
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
