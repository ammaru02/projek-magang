import React from 'react';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Visimisi from './components/pages/Visimisi';
import Sejarah from './components/pages/Sejarah';
import Produk from './components/pages/Produk';
import ProdukKategori from './components/pages/ProdukKategori';
import Keunggulan from './components/pages/Keunggulan';
import DetailProduk from './components/pages/DetailProduk';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profildesa' element={<Home />} />
        <Route path='/visimisi' element={<Visimisi />} />
        <Route path='/sejarah' element={<Sejarah />} />
        <Route path='/keunggulan' element={<Keunggulan/>} />
        <Route path='/produkdesa' element={<ProdukKategori />} />
        <Route path='/produk' element={<Produk />} />
        <Route path="/produkdetail/:id" element={<DetailProduk />} />
      </Routes>
    </Router>
  );
}

export default App;
