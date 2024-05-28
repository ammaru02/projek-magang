import React from 'react';
import HeaderAdmin from '../header/HeaderAdmin';
import Sidebar from '../sidebar/Sidebar';
import "./AdminData.css";
import DataAdmin from '../dataadmin/DataAdmin';

export default function HomeAdmin() {
    return (
        <div>
            <HeaderAdmin/>
            <div className='sidebar-container'>
                <Sidebar/> 
                <DataAdmin/>
            </div>       
        </div>
    )
}