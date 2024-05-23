import React, { useEffect, useState } from 'react';
import './AdminProfilDesa.css';
import { storage, ref, uploadBytesResumable, getDownloadURL } from "./txtImgConfig";

export default function AdminProfilDesa() {
  const [showVisiMisiForm, setShowVisiMisiForm] = useState(true);
  const [showSejarahForm, setShowSejarahForm] = useState(false);
  const [showKeunggulanForm, setShowKeunggulanForm] = useState(false);
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [strukturDesaImageUrl, setStrukturDesaImageUrl] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchVisiMisi();
  }, []);

  const handleAddButtonClick = () => {
    setShowAddForm(true);
    setShowEditForm(false); // Tambahkan baris ini
  }

  const handleEditButtonClick = () => {
    setShowEditForm(true);
    setShowAddForm(false); // Tambahkan baris ini
  }

  const handleCancelClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  }

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const fetchVisiMisi = async () => {
    try {
      const responseVisi = await fetch('http://127.0.0.1:5000/visi');
      const dataVisi = await responseVisi.json();
      if (dataVisi && dataVisi.length > 0) {
        setVisi(dataVisi[0].visi);
        setStrukturDesaImageUrl(dataVisi[0].foto);
      }

      const responseMisi = await fetch('http://127.0.0.1:5000/misi');
      const dataMisi = await responseMisi.json();
      if (dataMisi && dataMisi.length > 0) {
        setMisi(dataMisi.map(misiItem => misiItem.misi).join("\n"));
      }
    } catch (error) {
      console.error('Error fetching visi/misi:', error);
    }
  };

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
  const handleVisiChange = (e) => {
    setVisi(e.target.value);
  };

  const handleMisiChange = (e) => {
    setMisi(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImageFile(file);
    setStrukturDesaImageUrl(URL.createObjectURL(file));
  };

  const handleVisiMisiSubmit = async (e) => {
    e.preventDefault();
    try {
      let fotoFilename = 'default.jpg';
      if (selectedImageFile) {
        const storageRef = ref(storage, `images/struktur/${selectedImageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImageFile);
  
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            snapshot => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload progress:', progress);
            },
            error => {
              console.error('Error uploading image:', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Firebase download URL:', downloadURL);
              setStrukturDesaImageUrl(downloadURL);
              fotoFilename = downloadURL;
              resolve();
            }
          );
        });
      }
  
      const visiResponse = await fetch('http://127.0.0.1:5000/visi', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ visi, foto: fotoFilename })
      });
      const visiData = await visiResponse.json();
      console.log('Visi response:', visiData);
  
      const misiResponse = await fetch('http://127.0.0.1:5000/misi', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ misi })
      });
      
      const misiData = await misiResponse.json();
      console.log('Misi response:', misiData);
  
      fetchVisiMisi();
      alert('Data visi dan misi berhasil disimpan');
    } catch (error) {
      console.error('Error creating visi/misi:', error);
    }
  };
  
  return (
    <div className='profildesa-container'>
      <div className="buttons-container">
        <button onClick={handleVisiMisiClick}>Visi Misi dan Struktur Desa</button>
        <button onClick={handleSejarahDesaClick}>Sejarah Desa</button>
        <button onClick={handleKeunggulanDesaClick}>Keunggulan Desa</button>
      </div>
      {showVisiMisiForm && (
        <form className="form-container" onSubmit={handleVisiMisiSubmit}>
          <label htmlFor="visi">Visi Desa</label>
          <textarea 
            id="visi" 
            name="visi" 
            rows="4" 
            cols="50" 
            value={visi} 
            onChange={handleVisiChange}
          ></textarea>
          <br />
          <label htmlFor="misi">Misi Desa</label>
          <textarea 
            id="misi" 
            name="misi" 
            rows="4" 
            cols="50" 
            value={misi} 
            onChange={handleMisiChange}
          ></textarea>
          <br />
          <label htmlFor="gambar">Gambar Struktur Desa</label>
          {strukturDesaImageUrl && (
            <div>
              <img src={strukturDesaImageUrl} alt="Struktur Desa" style={{ width: '200px', height: 'auto' }} />
            </div>
          )}
          <input 
            type="file" 
            id="gambar" 
            name="gambar" 
            accept="image/*" 
            onChange={handleImageChange}
          />
          <br />
          <button type="submit">Simpan</button>
        </form>
      )}
      {showSejarahForm && (
        <form className="form-container">
          <label htmlFor="gambar">Upload Gambar</label>
          <input type="file" id="gambar" name="gambar" accept="image/*" />
          <br />
          <label htmlFor="sejarah">Deskripsi</label>
          <textarea id="sejarah" name="sejarah" rows="4" cols="50"></textarea>
          <br />
          <button type="submit">Simpan</button>
        </form>
      )}
      {showKeunggulanForm && (
        <div>
          {!showAddForm && !showEditForm && (
            <>
              <div className="toolbar-profil">
                <button className="add-button" onClick={handleAddButtonClick}>
                  <i className="fas fa-plus"></i>
                  <p>Tambah Keunggulan</p>
                </button>
                <div className='search'>
                  <input
                    type='text'
                    placeholder='Cari Produk..'
                    value={searchInput}
                    onChange={handleInputChange}
                  />
                  <i className='fas fa-search'></i>
                </div>
              </div>
              <div className='table-container'>
              <table className='profil-table'>
                <thead>
                  <tr>
                    <th>Gambar</th>
                    <th>Deskripsi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Isi tabel dengan data keunggulan */}
                  <tr>
                    <td><img src="path/to/image.jpg" alt="Gambar Keunggulan" style={{ width: '100px', height: 'auto' }} /></td>
                    <td>Deskripsi keunggulan</td>
                    <td>
                      <div style={{ display: "flex" }}>
                        <i
                          className="fas fa-times"
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            fontSize: "15px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            padding: "3px",
                            marginRight: "5px",
                          }}                              
                          ></i>
                          <i
                            className="fas fa-edit"
                            style={{
                            color: "#000",
                            fontSize: "20px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            marginRight: "5px",
                            padding: "0",
                            }}
                            onClick={() => handleEditButtonClick()}
                            ></i>
                      </div>
                    </td>
                  </tr>
                  {/* Tambahkan baris lain jika diperlukan */}
                </tbody>
              </table>
              </div>
            </>
          )}
          {showAddForm && (
            <form className="form-container">
              <label htmlFor="gambar">Upload Gambar</label>
              <input type="file" id="gambar" name="gambar" accept="image/*" />
              <br />
              <label htmlFor="keunggulan">Deskripsi</label>
              <textarea id="keunggulan" name="keunggulan" rows="4" cols="50"></textarea>
              <br />
              <button type="submit">Simpan</button>
              <button type="button" onClick={handleCancelClick}>Batal</button>
            </form>
          )}
          {showEditForm && (
            <form className="form-container">
              <label htmlFor="gambar">Upload Gambar</label>
              <input type="file" id="gambar" name="gambar" accept="image/*" />
              <br />
              <label htmlFor="keunggulan">Deskripsi</label>
              <textarea id="keunggulan" name="keunggulan" rows="4" cols="50"></textarea>
              <br />
              <button type="submit">Simpan</button>
              <button type="button" onClick={handleCancelClick}>Batal</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
