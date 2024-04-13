import React from 'react'
import './Sejarah.css'
import Navbar from '../header/Navbar'
import Footer from '../footer/Footer'
import SejarahDesa from '../sejarahdesa/SejarahDesa'

export default function Sejarah() {
  return (
    <div className='pages-sejarah'>
      <Navbar/>
      <SejarahDesa/>
      <Footer/>
    </div>
  )
}