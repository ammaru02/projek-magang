import React, { useEffect, useState } from 'react';
import './AdminProfilDesa.css';
import { storage, ref, uploadBytesResumable, getDownloadURL } from "./txtImgConfig";

export default function AdminProfilDesa() {
  const [showVisiMisiForm, setShowVisiMisiForm] = useState(true);
  const [showStrukturDesa, setShowStrukturDesa] = useState(false);
  const [showSejarahForm, setShowSejarahForm] = useState(false);
  const [sejarahDesa, setSejarahDesa] = useState("");
  const [sejarahImageUrl, setSejarahImageUrl] = useState("");
  const [showKeunggulanForm, setShowKeunggulanForm] = useState(false);
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [strukturDesaImageUrl, setStrukturDesaImageUrl] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddStrukturForm, setShowAddStrukturForm] = useState(false);
  const [showEditStrukturForm, setShowEditStrukturForm] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [keunggulan, setKeunggulan] = useState([]);
  const [keunggulanImage, setKeunggulanImage] = useState(null);
  const [keunggulanDescription, setKeunggulanDescription] = useState("");
  const [keunggulanToEdit, setKeunggulanToEdit] = useState(null);

  useEffect(() => {
    fetchVisiMisi();
    fetchKeunggulan();
  }, []);

  const handleAddButtonClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setShowAddStrukturForm(true);
    setShowEditStrukturForm(false);
  };

  const handleStrukturDesaClick = () => {
    setShowVisiMisiForm(false);
    setShowSejarahForm(false);
    setShowKeunggulanForm(false);
    setShowStrukturDesa(true);
  };

  const handleEditButtonClick = (id) => {
    const selectedKeunggulan = keunggulan.find((item) => item.id === id);
    setKeunggulanToEdit(selectedKeunggulan);
    setShowEditForm(true);
    setShowAddForm(false);
    setShowAddStrukturForm(false);
    setShowEditStrukturForm(true);
  };  

  const handleCancelClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowAddStrukturForm(false);
    setShowEditStrukturForm(false);
  };

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

      const responseSejarah = await fetch('http://127.0.0.1:5000/sejarah');
      const dataSejarah = await responseSejarah.json();
      if (dataSejarah && dataSejarah.length > 0) {
        setSejarahDesa(dataSejarah[0].deskripsi);
        setSejarahImageUrl(dataSejarah[0].foto);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchKeunggulan = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/keunggulan');
      const data = await response.json();
      setKeunggulan(data.data || []);
    } catch (error) {
      console.error('Error fetching keunggulan:', error);
    }
  };

  const handleVisiMisiClick = () => {
    setShowVisiMisiForm(true);
    setShowSejarahForm(false);
    setShowKeunggulanForm(false);
    setShowStrukturDesa(false)
  };

  const handleSejarahDesaClick = () => {
    setShowVisiMisiForm(false);
    setShowSejarahForm(true);
    setShowKeunggulanForm(false);
    setShowStrukturDesa(false)
  };

  const handleKeunggulanDesaClick = () => {
    setShowVisiMisiForm(false);
    setShowSejarahForm(false);
    setShowKeunggulanForm(true);
    setShowStrukturDesa(false)
  };

  const handleSejarahChange = (e) => {
    setSejarahDesa(e.target.value);
  };

  const handleSejarahImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImageFile(file);
    setSejarahImageUrl(URL.createObjectURL(file));
  };

  const handleKeunggulanImageChange = (e) => {
    const file = e.target.files[0];
    setKeunggulanImage(file);
  };

  const handleKeunggulanDescriptionChange = (e) => {
    if (showEditForm) {
      setKeunggulanToEdit({ ...keunggulanToEdit, deskripsi: e.target.value });
    } else {
      setKeunggulanDescription(e.target.value);
    }
  };  

  const handleSejarahSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedImageFile) {
        const storageRef = ref(storage, `images/sejarah/${selectedImageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImageFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload progress:', progress);
          },
          (error) => {
            console.error('Error uploading image:', error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Firebase download URL:', downloadURL);
              
              setSejarahImageUrl(downloadURL);

              const response = await fetch('http://127.0.0.1:5000/sejarah', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ deskripsi: sejarahDesa, foto: downloadURL })
              });
              const data = await response.json();
              console.log('Sejarah response:', data);
              alert('Data sejarah berhasil disimpan');
            } catch (error) {
              console.error('Error sending sejarah data:', error);
            }
          }
        );
      } else {
        const response = await fetch('http://127.0.0.1:5000/sejarah', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ deskripsi: sejarahDesa })
        });
        const data = await response.json();
        console.log('Sejarah response:', data);
        alert('Data sejarah berhasil disimpan');
      }
    } catch (error) {
      console.error('Error updating sejarah:', error);
    }
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
  
  const handleAddSubmit = async (e) => {

  }

  const handleEditSubmit = async (e) =>{

  }

  const handleKeunggulanSubmit = async (e) => {
    e.preventDefault();
    try {
      let downloadURL = '';
      if (keunggulanImage) {
        const storageRef = ref(storage, `images/keunggulan/${keunggulanImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, keunggulanImage);
  
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload progress:', progress);
            },
            (error) => {
              console.error('Error uploading image:', error);
              reject(error);
            },
            async () => {
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Firebase download URL:', downloadURL);
              resolve();
            }
          );
        });
      }
  
      const payload = { deskripsi: keunggulanDescription, foto: downloadURL };
      console.log('Sending payload:', payload);
  
      const response = await fetch('http://127.0.0.1:5000/keunggulan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('Keunggulan response:', data);
      if (response.ok) {
        alert('Data keunggulan berhasil disimpan');
        fetchKeunggulan();
        handleCancelClick();
      } else {
        console.error('Failed to save keunggulan:', data);
        alert('Gagal menyimpan keunggulan');
      }
    } catch (error) {
      console.error('Error adding keunggulan:', error);
    }
  };
  
const handleKeunggulanEditSubmit = async (e) => {
  e.preventDefault();
  try {
    let downloadURL = keunggulanToEdit.foto; // Default to existing foto URL if no new image is uploaded

    if (keunggulanImage) {
      const storageRef = ref(storage, `images/keunggulan/${keunggulanImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, keunggulanImage);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload progress:', progress);
          },
          (error) => {
            console.error('Error uploading image:', error);
            reject(error);
          },
          async () => {
            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Firebase download URL:', downloadURL);
            resolve();
          }
        );
      });
    }

    const payload = { deskripsi: keunggulanToEdit.deskripsi, foto: downloadURL };
    console.log('Sending payload:', payload);

    const response = await fetch(`http://127.0.0.1:5000/keunggulan/${keunggulanToEdit.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Keunggulan edit response:', data);
      alert('Data keunggulan berhasil diperbarui');
      fetchKeunggulan();
      handleCancelClick();
    } else {
      const errorData = await response.json();
      console.error('Failed to update keunggulan:', errorData);
      alert('Gagal memperbarui keunggulan');
    }
  } catch (error) {
    console.error('Error editing keunggulan:', error);
  }
};


  const handleDeleteButtonClick = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/keunggulan/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log('Keunggulan delete response:', data);
      alert('Data keunggulan berhasil dihapus');
      fetchKeunggulan();
    } catch (error) {
      console.error('Error deleting keunggulan:', error);
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
          <button onClick={handleStrukturDesaClick} className='btn-struktur'>Lihat Data Struktur Desa</button>
        </form>
      )}
       {showStrukturDesa && (
        <div>
        <div className='struktur-table-container'>
          <h2 className='judul-struktur'>Data Struktur Desa</h2>
          {!showAddStrukturForm && !showEditStrukturForm && (
          <>
          <div className="toolbar-profil">
                <button className="add-button" onClick={handleAddButtonClick}>
                  <i className="fas fa-plus"></i>
                  <p>Tambah Struktur</p>
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
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Foto</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* Isi tabel dengan data struktur desa */}
              <tr>
                <td>Nama Anggota 1</td>
                <td>Jabatan Anggota 1</td>
                <td><img src='#' alt='gambar'/></td>
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
                      onClick={() => handleDeleteButtonClick()}
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
            </tbody>
          </table>
          </div>
          </>
          )}
        </div>
        {showAddStrukturForm && (
          <form className="form-container" onSubmit={handleAddSubmit}>
            <label htmlFor="nama">Nama Anggota</label>
            <input type="text" id="nama" name="nama" />
            <br />
            <label htmlFor="jabatan">Jabatan</label>
            <input type="text" id="jabatan" name="jabatan" />
            <br />
            <label htmlFor="gambar">Gambar</label>
            <input type="file" id="gambar" name="gambar" accept="image/*" />
            <br />
            <button type="submit">Simpan</button>
            <button type="button" onClick={handleCancelClick}>Batal</button>
          </form>
        )}

        {showEditStrukturForm &&  (
          <form className="form-container" onSubmit={handleEditSubmit}>
            <label htmlFor="nama">Nama Anggota</label>
            <input type="text" id="nama" name="nama" />
            <br />
            <label htmlFor="jabatan">Jabatan</label>
            <input type="text" id="jabatan" name="jabatan" />
            <br />
            <label htmlFor="gambar">Gambar</label>
            <input type="file" id="gambar" name="gambar" accept="image/*"  />
            <br />
            <button type="submit">Simpan</button>
            <button type="button" onClick={handleCancelClick}>Batal</button>
          </form>
        )}
        </div>
      )}
      {showSejarahForm && (
        <form className="form-container" onSubmit={handleSejarahSubmit}>
          <label htmlFor="sejarah">Deskripsi Sejarah Desa</label>
          <textarea 
            id="sejarah" 
            name="sejarah" 
            rows="4" 
            cols="50" 
            value={sejarahDesa} 
            onChange={handleSejarahChange}
          ></textarea>
          <br />
          <label htmlFor="gambarSejarah">Gambar Sejarah Desa</label>
          {sejarahImageUrl && (
            <div>
              <img src={sejarahImageUrl} alt="Sejarah Desa" style={{ width: '200px', height: 'auto' }} />
            </div>
          )}
          <input 
            type="file" 
            id="gambarSejarah" 
            name="gambarSejarah" 
            accept="image/*" 
            onChange={handleSejarahImageChange}
          />
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
                    {keunggulan.map((item, index) => (
                      <tr key={index}>
                        <td><img src={item.foto} alt="Gambar Keunggulan" style={{ width: '100px', height: 'auto' }} /></td>
                        <td>{item.deskripsi}</td>
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
                            onClick={() => handleDeleteButtonClick(item.id)}
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
                            onClick={() => handleEditButtonClick(item.id)}
                          ></i>
                        </div>
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {showEditForm && keunggulanToEdit && (
          <form className="form-container" onSubmit={handleKeunggulanEditSubmit}>
            <label htmlFor="gambar">Upload Gambar</label>
            <input type="file" id="gambar" name="gambar" accept="image/*" onChange={handleKeunggulanImageChange} />
            {keunggulanToEdit.foto && (
              <div>
                <img src={keunggulanToEdit.foto} alt="Gambar Keunggulan" style={{ width: '200px', height: 'auto' }} />
              </div>
            )}
            <br />
            <label htmlFor="keunggulan">Deskripsi</label>
            <textarea id="keunggulan" name="keunggulan" rows="4" cols="50" value={keunggulanToEdit.deskripsi} onChange={handleKeunggulanDescriptionChange}></textarea>
            <br />
            <button type="submit">Simpan</button>
            <button type="button" onClick={handleCancelClick}>Batal</button>
          </form>
        )}
          {showAddForm && (
            <form className="form-container" onSubmit={handleKeunggulanSubmit}>
              <label htmlFor="gambar">Upload Gambar</label>
              <input type="file" id="gambar" name="gambar" accept="image/*" onChange={handleKeunggulanImageChange} />
              <br />
              <label htmlFor="keunggulan">Deskripsi</label>
              <textarea id="keunggulan" name="keunggulan" rows="4" cols="50" onChange={handleKeunggulanDescriptionChange}></textarea>
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
