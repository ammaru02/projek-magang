import React from 'react'
import Navbar from '../header/Navbar'
import Footer from '../footer/Footer'
import VisimisiStruktu from '../visimisi-struktur/VisimisiStruktur'
import './Visimisi.css';

export default function Visimisi() {
  return (
    <div className='pages-visimisi'>
      <Navbar/>
      <VisimisiStruktu/>
      <Footer/>
    </div>
  )
}
