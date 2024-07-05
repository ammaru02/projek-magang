import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminProfilDesa.css';
import { storage, ref, uploadBytesResumable, getDownloadURL } from "./txtImgConfig";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminProfilDesa() {
  const [showVisiMisiForm, setShowVisiMisiForm] = useState(true);
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
  const [searchInput, setSearchInput] = useState("");
  const [keunggulan, setKeunggulan] = useState([]);
  const [keunggulanImage, setKeunggulanImage] = useState(null);
  const [keunggulanDescription, setKeunggulanDescription] = useState("");
  const [keunggulanToEdit, setKeunggulanToEdit] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [showStrukturDesa, setShowStrukturDesa] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [strukturDesaData, setStrukturDesaData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showAddStrukturForm, setShowAddStrukturForm] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showEditStrukturForm, setShowEditStrukturForm] = useState(false);
  const [adminData, setAdminData] = useState(null); 
  const [activePage, setActivePage] = useState('visi-misi');

  useEffect(() => {
    fetchInitialData();
    fetchAdminData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchVisiMisi(),
        fetchKeunggulan(),
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchAdminData = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/admin/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const adminData = response.data;
        setAdminData(adminData); // Tambahkan ini
    } catch (error) {
        console.error("Error fetching admin data:", error);
    }
};

  const handleAddButtonClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setShowAddStrukturForm(false);
    setShowEditStrukturForm(false);
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
    setActivePage('visi-misi');
  };

  const handleSejarahDesaClick = () => {
    setShowVisiMisiForm(false);
    setShowSejarahForm(true);
    setShowKeunggulanForm(false);
    setShowStrukturDesa(false)
    setActivePage('sejarah-desa');
  };

  const handleKeunggulanDesaClick = () => {
    setShowVisiMisiForm(false);
    setShowSejarahForm(false);
    setShowKeunggulanForm(true);
    setShowStrukturDesa(false)
    setActivePage('keunggulan-desa');
  };

  const handleSejarahChange = (value) => {
    setSejarahDesa(value);
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


  const handleKeunggulanDescriptionChange = (value) => {
    if (showEditForm) {
      setKeunggulanToEdit({ ...keunggulanToEdit, deskripsi: value });
    } else {
      setKeunggulanDescription(value);
    }
  };  

  const handleSejarahSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedImageFile) {
        const storageRef = ref(storage, `images/sejarah/${selectedImageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImageFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload progress:", progress);
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Firebase download URL:", downloadURL);
              setSejarahImageUrl(downloadURL);

              const response = await fetch("http://127.0.0.1:5000/sejarah", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ deskripsi: sejarahDesa, foto: downloadURL }),
              });
              const data = await response.json();
              console.log("Sejarah response:", data);
              alert("Data sejarah berhasil disimpan");
            } catch (error) {
              console.error("Error sending sejarah data:", error);
            }
          }
        );
      } else {
        const response = await fetch("http://127.0.0.1:5000/sejarah", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deskripsi: sejarahDesa }),
        });
        const data = await response.json();
        console.log("Sejarah response:", data);
        alert("Data sejarah berhasil disimpan");
      }
    } catch (error) {
      console.error("Error updating sejarah:", error);
    }
  };

  const handleVisiChange = (content) => {
    setVisi(content);
  };

  const handleMisiChange = (content) => {
    setMisi(content);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImageFile(file);
    setStrukturDesaImageUrl(URL.createObjectURL(file));
  };

  const handleVisiMisiSubmit = async (e) => {
    e.preventDefault();
    try {
      let fotoFilename = null;
      
      // Check if there's an image file to upload
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append('file', selectedImageFile);
  
        // Upload the image
        const imageUploadResponse = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData
        });
        
        const imageUploadData = await imageUploadResponse.json();
        fotoFilename = imageUploadData.filename;  // Adjust this if your backend returns a different property
      }
  
      // Create payload for visi
      const visiPayload = { visi };
      if (fotoFilename) {
        visiPayload.foto = fotoFilename;
      }
  
      // Send visi data
      const visiResponse = await fetch('http://127.0.0.1:5000/visi', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(visiPayload)
      });
      const visiData = await visiResponse.json();
      console.log('Visi response:', visiData);
  
      // Create payload for misi
      const misiPayload = { misi };
  
      // Send misi data
      const misiResponse = await fetch('http://127.0.0.1:5000/misi', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(misiPayload)
      });
  
      const misiData = await misiResponse.json();
      console.log('Misi response:', misiData);
  
      // Fetch updated visi-misi data
      fetchVisiMisi();
      alert('Data visi dan misi berhasil disimpan');
    } catch (error) {
      console.error('Error creating visi/misi:', error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleEditStrukturButtonClick = (id) => {
    setShowEditStrukturForm(true);
    setShowKeunggulanForm(false);
    setShowEditForm(false);
    setShowStrukturDesa(true);
  };

// Fungsi untuk menangani tombol edit keunggulan
const handleEditKeunggulanButtonClick = (id) => {
  const selectedKeunggulan = keunggulan.find((item) => item.id === id);
  setKeunggulanToEdit(selectedKeunggulan);
  setShowEditForm(true);
  setShowAddForm(false);
  setShowAddStrukturForm(false);
  setShowEditStrukturForm(false);
};

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
        // If new image is uploaded, upload it to Firebase Storage
        const storageRef = ref(storage, `images/keunggulan/${keunggulanImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, keunggulanImage);
  
        // Monitor upload progress and get download URL after upload
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
  
      // Prepare payload for PUT request
      const payload = {
        deskripsi: keunggulanToEdit.deskripsi,
        foto: keunggulanImage ? downloadURL : keunggulanToEdit.foto // Use new downloadURL if uploaded, otherwise keep existing foto
      };
  
      console.log('Sending payload:', payload);
  
      // Send PUT request to update keunggulan data
      const response = await fetch(`http://127.0.0.1:5000/keunggulan/${keunggulanToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // Handle response from server
      if (response.ok) {
        const data = await response.json();
        console.log('Keunggulan edit response:', data);
        alert('Data keunggulan berhasil diperbarui');
        fetchKeunggulan(); // Fetch updated data
        handleCancelClick(); // Cancel edit mode
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
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }
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
      <button
        onClick={handleVisiMisiClick}
        style={{
          backgroundColor: activePage === 'visi-misi' ? '#ccc' : '#f0f0f0'
        }}
      >
        Visi Misi dan Struktur Desa
      </button>
      <button
        onClick={handleSejarahDesaClick}
        style={{
          backgroundColor: activePage === 'sejarah-desa' ? '#ccc' : '#f0f0f0'
        }}
      >
        Sejarah Desa
      </button>
      <button
        onClick={handleKeunggulanDesaClick}
        style={{
          backgroundColor: activePage === 'keunggulan-desa' ? '#ccc' : '#f0f0f0'
        }}
      >
        Keunggulan Desa
      </button>
      </div>
{showVisiMisiForm && (
        <form className="form-container" onSubmit={handleVisiMisiSubmit}>
          <label htmlFor="visi">Visi Desa</label>
          <ReactQuill 
            id="visi" 
            name="visi" 
            rows="4" 
            cols="50" 
            value={visi} 
            onChange={handleVisiChange}
          ></ReactQuill>
          <br />
          <label htmlFor="misi">Misi Desa</label>
          <ReactQuill 
            id="misi" 
            name="misi" 
            rows="4" 
            cols="50" 
            value={misi} 
            onChange={handleMisiChange}
          ></ReactQuill>
          <br />
          <label htmlFor="gambar">Gambar Struktur Desa</label>
          {strukturDesaImageUrl && (
            <div>
              <img src={strukturDesaImageUrl} alt="Struktur Desa" style={{ width: '200px', height: 'auto' }} />
            </div>
          )}
          {adminData && adminData.level !== 'kepala desa' && (
          <input 
            type="file" 
            id="gambar" 
            name="gambar" 
            accept="image/*" 
            onChange={handleImageChange}
          />)}
          <br />
          {adminData && adminData.level !== 'kepala desa' && (
            <div>
          <button type="submit">Simpan</button>
          </div>)}
        </form>
)}

{showSejarahForm && (
        <form className="form-container" onSubmit={handleSejarahSubmit}>
          <label htmlFor="sejarah">Deskripsi Sejarah Desa</label>
          <ReactQuill 
            id="sejarah" 
            name="sejarah" 
            rows="4" 
            cols="50" 
            value={sejarahDesa} 
            onChange={handleSejarahChange}
          ></ReactQuill>
          <br />
          <label htmlFor="gambarSejarah">Gambar Sejarah Desa</label>
          {sejarahImageUrl && (
            <div>
              <img src={sejarahImageUrl} alt="Sejarah Desa" style={{ width: '200px', height: 'auto' }} />
            </div>
          )}
          {adminData && adminData.level !== 'kepala desa' && (
          <input 
            type="file" 
            id="gambarSejarah" 
            name="gambarSejarah" 
            accept="image/*" 
            onChange={handleSejarahImageChange}
          />)}
          <br />
          {adminData && adminData.level !== 'kepala desa' && (
          <button type="submit">Simpan</button>)}
        </form>
)}
{showKeunggulanForm && (
        <div>
          {!showAddForm && !showEditForm && (
            <>
              <div className="toolbar-profil">
              {adminData && adminData.level !== 'kepala desa' && (
                <button className="add-button" onClick={handleAddButtonClick}>
                  <i className="fas fa-plus"></i>
                  <p>Tambah Keunggulan</p>
                </button>)}
                <div className='search'>
                  <input
                    type='text'
                    placeholder='Cari Keunggulan..'
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
                        {adminData && adminData.level !== 'kepala desa' && (
                            <th>Aksi</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {keunggulan.map((item, index) => (
                        <tr key={index}>
                            <td><img src={item.foto} alt="Gambar Keunggulan" style={{ width: '100px', height: 'auto' }} /></td>
                            <td className="truncate-three-lines-keunggulan">
                                <div dangerouslySetInnerHTML={{ __html: item.deskripsi }} />
                            </td>
                            {adminData && adminData.level !== 'kepala desa' && (
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
                                                marginRight: "8px",
                                                marginLeft: "5px"
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
                                                marginLeft: "8px",
                                                marginRight: "5px",
                                                padding: "0",
                                            }}
                                            onClick={() => handleEditKeunggulanButtonClick(item.id)}
                                        ></i>
                                    </div>
                                </td>
                            )}
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
          <ReactQuill
            id="keunggulan"
            name="keunggulan"
            rows="4"
            cols="50"
            value={keunggulanToEdit.deskripsi}
            onChange={handleKeunggulanDescriptionChange}
          />
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
              <ReactQuill id="keunggulan" name="keunggulan" rows="4" cols="50" onChange={handleKeunggulanDescriptionChange}></ReactQuill>
              <br />
              <button className='button-form-keunggulan' type="submit">Simpan</button>
              <button className='button-form-keunggulan' type="button" onClick={handleCancelClick}>Batal</button>
            </form>
          )}
        </div>
)}
    </div>
  );
}
