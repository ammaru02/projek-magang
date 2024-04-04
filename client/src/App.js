import React from 'react';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Visimisi from './components/pages/Visimisi';
import Sejarah from './components/pages/Sejarah';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profildesa' element={<Home />} />
        <Route path='/visimisi' element={<Visimisi />} />
        <Route path='/sejarah' element={<Sejarah />} />
      </Routes>
    </Router>
  );
}

export default App;
