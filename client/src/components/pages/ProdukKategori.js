import React from 'react'
import './Produk.css'
import Navbar from '../header/Navbar'
import Footer from '../footer/Footer'
import KategoriProduk from '../produk/KategoriProduk'

export default function Produk() {
  return (
    <div className='pages-kategori'>
      <Navbar/>
      <KategoriProduk/>
      <Footer/>
    </div>
  )
}