import React from 'react'
import './Produk.css'
import Navbar from '../header/Navbar'
import Footer from '../footer/Footer'
import ProdukAll from '../produk/ProdukAll'

export default function Produk() {
  return (
    <div className='pages-produk'>
      <Navbar/>
      <ProdukAll/>
      <Footer/>
    </div>
  )
}