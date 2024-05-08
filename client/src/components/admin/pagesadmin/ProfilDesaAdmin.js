import React from 'react'
import "./ProfilDesaAdmin.css"
import HeaderAdmin from '../header/HeaderAdmin'
import Sidebar from '../sidebar/Sidebar'
import AdminProfilDesa from '../profiladmin/AdminProfilDesa'

export default function ProfilDesaAdmin() {
  return (
    <div>
        <HeaderAdmin/>
        <div className='sidebar-container'>
            <Sidebar/> 
            <AdminProfilDesa/>
        </div>       
    </div>
  )
}
