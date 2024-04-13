import React from 'react'
import './Produk.css'
import Navbar from '../header/Navbar'
import Footer from '../footer/Footer'
import Blog from '../blog/BlogPost'

export default function Produk() {
  return (
    <div className='pages-produk'>
      <Navbar/>
      <Blog/>
      <Footer/>
    </div>
  )
}