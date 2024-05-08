import React from 'react'
import "./HeaderAdmin.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const HeaderAdmin = () => {
  return (
    <div className='header-admin'>
        <div className='headerWrapper'>
            <div className='headerleft'>
                <h2 className='header-title'>DESA KASSI</h2>
            </div>
            <div className='headerright'>
                <div className='headerIconContainer'>
                    <FontAwesomeIcon icon={faBell}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeaderAdmin
