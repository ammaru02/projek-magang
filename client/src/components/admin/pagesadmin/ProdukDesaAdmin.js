import React from 'react'
import "./ProdukDesaAdmin.css"
import HeaderAdmin from '../header/HeaderAdmin'
import Sidebar from '../sidebar/Sidebar'
import AdminProdukDesa from '../produkadmin/AdminProdukDesa'
export default function ProdukDesaAdmin() {
  return (
    <div>
        <HeaderAdmin/>
        <div className='sidebar-container'>
            <Sidebar/> 
            <AdminProdukDesa/>
        </div>       
    </div>
  )
}
