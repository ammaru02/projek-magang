// HomeAdmin.js
import React from 'react';
import HeaderAdmin from '../header/HeaderAdmin';
import Sidebar from '../sidebar/Sidebar';
import ArtikelAdmin from '../artikeladmin/ArtikelAdmin'; // Ensure the correct import path

import "./HomeAdmin.css";

export default function HomeAdmin() {
    return (
        <div>
            <HeaderAdmin/>
            <div className='sidebar-container'>
                <Sidebar/> 
                <ArtikelAdmin/>
            </div>       
        </div>
    )
}
