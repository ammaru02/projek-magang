import React from 'react';
import HeaderAdmin from '../header/HeaderAdmin';
import Sidebar from '../sidebar/Sidebar';
import BannerAdmin from '../banneradmin/BannerAdmin';

import "./HomeAdmin.css";

export default function HomeAdmin() {
    return (
        <div>
            <HeaderAdmin/>
            <div className='sidebar-container'>
                <Sidebar/> 
                <BannerAdmin/>
            </div>       
        </div>
    )
}