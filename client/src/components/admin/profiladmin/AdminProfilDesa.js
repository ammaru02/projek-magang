import React, { useState } from 'react';
import './AdminProfilDesa.css'; // Import file CSS untuk styling

export default function AdminProfilDesa() {
  const [showVisiMisiForm, setShowVisiMisiForm] = useState(true); // Ubah menjadi true agar form pertama muncul
  const [showSejarahForm, setShowSejarahForm] = useState(false);
  const [showKeunggulanForm, setShowKeunggulanForm] = useState(false);

  const handleVisiMisiClick = () => {
    setShowVisiMisiForm(true);
    setShowSejarahForm(false);
    setShowKeunggulanForm(false);
  };

  const handleSejarahDesaClick = () => {
    setShowVisiMisiForm(false);
    setShowSejarahForm(true);
    setShowKeunggulanForm(false);
  };

  const handleKeunggulanDesaClick = () => {
    setShowVisiMisiForm(false);
    setShowSejarahForm(false);
    setShowKeunggulanForm(true);
  };

  return (
    <div className='profildesa-container'>
      <div className="buttons-container">
        <button onClick={handleVisiMisiClick}>Visi Misi dan Struktur Desa</button>
        <button onClick={handleSejarahDesaClick}>Sejarah Desa</button>
        <button onClick={handleKeunggulanDesaClick}>Keunggulan Desa</button>
      </div>
      {showVisiMisiForm && (
        <form className="form-container">
            <label htmlFor="visi">Visi Desa</label>
            <textarea id="visi" name="visi" rows="4" cols="50"></textarea>
            <br />
            <label htmlFor="misi">Misi Desa</label>
            <textarea id="misi" name="misi" rows="4" cols="50"></textarea>
            <br />
            <label htmlFor="gambar">Gambar Struktur Desa</label>
            <input type="file" id="gambar" name="gambar" accept="image/*" />
            <br />
            <button type="submit">Simpan</button>
        </form>
      )}
      {showSejarahForm && (
        <form className="form-container">
            <label htmlFor="gambar">Uploud Gambar</label>
            <input type="file" id="gambar" name="gambar" accept="image/*" />
            <br />
            <label htmlFor="sejarah">Deskirpsi</label>
            <textarea id="sejarah" name="sejarah" rows="4" cols="50"></textarea>
            <br />
            <button type="submit">Simpan</button>
        </form>
      )}
      {showKeunggulanForm && (
        <form className="form-container">
            <label htmlFor="gambar">Uploud Gambar</label>
            <input type="file" id="gambar" name="gambar" accept="image/*" />
            <br />
            <label htmlFor="keunggulan">Deskripsi</label>
            <textarea id="keunggulan" name="keunggulan" rows="4" cols="50"></textarea>
            <br />
            <button type="submit">Simpan</button>
        </form>
      )}
    </div>
  );
}
