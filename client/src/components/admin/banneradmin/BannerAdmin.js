import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import "./BannerAdmin.css";

export default function BannerAdmin() {
    const [banners, setBanners] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [adminData, setAdminData] = useState(null); 
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentBanner, setCurrentBanner] = useState(null);

    useEffect(() => {
      fetchAdminData();
        const fetchBanners = async () => {
          try {
            const response = await fetch("http://127.0.0.1:5000/banner");
            const result = await response.json();
            if (response.ok) {
              setBanners(result.data);
              setLoading(false);
            } else {
              setError(result.message);
              setLoading(false);
            }
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        };
    
        fetchBanners();
      }, []);
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
  };

  const handleEditButtonClick = (banner) => {
    setCurrentBanner(banner);
    setShowEditForm(true);
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gambarFile = formData.get('gambar');
  
    console.log("Form data before sending:", formData);
  
    try {
      if (gambarFile instanceof File) {
        const storage = getStorage(); // Initialize Firebase storage
        const fotoRef = ref(storage, `images/banner/${gambarFile.name}`);
        const uploadTask = uploadBytesResumable(fotoRef, gambarFile);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload progress: ", progress);
          },
          (error) => {
            console.error("Error uploading image:", error);
            setError("Failed to add banner: " + error.message);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Firebase download URL:", downloadURL);
  
            formData.set('url_gambar', downloadURL); // Update formData with the image URL
  
            console.log("Form data after setting URL:", formData);
  
            const response = await fetch("http://127.0.0.1:5000/banner", {
              method: "POST",
              body: formData,
            });
  
            if (response.ok) {
              const newBanner = await response.json();
              setBanners([...banners, newBanner]);
              setShowAddForm(false);
              window.location.reload();
              alert("Banner berhasil ditambahkan");
            } else {
              const result = await response.json();
              setError(result.message);
            }
          }
        );
      } else {
        const response = await fetch("http://127.0.0.1:5000/banner", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const newBanner = await response.json();
          setBanners([...banners, newBanner]);
          setShowAddForm(false);
        } else {
          const result = await response.json();
          setError(result.message);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };    

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gambarFile = formData.get('gambar');
  
    try {
      if (gambarFile instanceof File) {
        const storage = getStorage(); // Initialize Firebase storage
        const fotoRef = ref(storage, `images/banner/${gambarFile.name}`);
        const uploadTask = uploadBytesResumable(fotoRef, gambarFile);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload progress: ", progress);
          },
          (error) => {
            console.error("Error uploading image:", error);
            setError("Failed to update banner: " + error.message);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Firebase download URL:", downloadURL);
  
              const response = await fetch(`http://127.0.0.1:5000/banner/${currentBanner.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json", // Ensure Content-Type is JSON
                },
                body: JSON.stringify({ url_gambar: downloadURL }), // Send JSON data
              });
  
              if (response.ok) {
                const updatedBanner = await response.json();
                setBanners(
                  banners.map((banner) =>
                    banner.id === updatedBanner.id ? updatedBanner : banner
                  )
                );
                setShowEditForm(false);
                setCurrentBanner(null);
                alert("Banner berhasil diedit");
              } else {
                const result = await response.json();
                setError(result.message);
              }
            } catch (error) {
              setError(error.message);
            }
          }
        );
      } else {
        const response = await fetch(`http://127.0.0.1:5000/banner/${currentBanner.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Ensure Content-Type is JSON
          },
          body: JSON.stringify(Object.fromEntries(formData)), // Convert FormData to JSON
        });
  
        if (response.ok) {
          const updatedBanner = await response.json();
          setBanners(
            banners.map((banner) =>
              banner.id === updatedBanner.id ? updatedBanner : banner
            )
          );
          setShowEditForm(false);
          setCurrentBanner(null);
        } else {
          const result = await response.json();
          setError(result.message);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };  

  const handleDeleteButtonClick = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus banner ini?")) {
        return;
      }
    try {
      const response = await fetch(`http://127.0.0.1:5000/banner/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBanners(banners.filter((banner) => banner.id !== id));
      } else {
        const result = await response.json();
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setCurrentBanner(null);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='admin-banner-container'>
      <div className='title-admin-banner'>
        <h1>Banner</h1>
      </div>
      <div className='admin-banner-list'>
        {!showAddForm && !showEditForm && (
          <div className='toolbar-banner'>
            {adminData && adminData.level !== "kepala desa" && (
            <button className="add-button" onClick={handleAddButtonClick}>
              <i className="fas fa-plus"></i>
              <p>Tambah Banner</p>
            </button>)}
            <div className="search">
              <input
                type="text"
                placeholder="Cari Banner..."
                value={searchInput}
                onChange={handleInputChange}
              />
              <i className="fas fa-search"></i>
            </div>
          </div>
        )}
        {showAddForm && (
          <div className='form-add'>
            <form onSubmit={handleAddFormSubmit}>
              <h2>Tambah Banner</h2>
              <br />
              <div className="form-group">
                <label htmlFor="gambar">Gambar</label>
                <input
                  type="file"
                  id="gambar"
                  name="gambar"
                />
              </div>
              <div className="button-row">
                <button type="button" onClick={handleCancelClick}>
                  Batal
                </button>
                <button type="submit">Simpan</button>
              </div>
            </form>
          </div>
        )}
        {showEditForm && (
          <div className='form-edit'>
            <form onSubmit={handleEditFormSubmit}>
              <h2>Edit Banner</h2>
              <br />
              <div className="current-banner-image">
                <img
                  src={currentBanner.url_gambar} // Assuming this is the URL of the current banner image
                  alt={currentBanner.gambar}
                  className="current-banner-image"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gambar">Gambar</label>
                <input
                  type="file"
                  id="gambar"
                  name="gambar"
                />
              </div>
              <div className="button-row">
                <button type="button" onClick={handleCancelClick}>
                  Batal
                </button>
                <button type="submit">Simpan</button>
              </div>
            </form>
          </div>
        )}

        {!showAddForm && !showEditForm && banners && banners.length > 0 && (
          <div>
            <table className='banner-table'>
              <thead>
                <tr>
                  <th>Gambar</th>
                  {adminData && adminData.level !== 'kepala desa' && (
                  <th className='aksi'>Aksi</th>)}
                </tr>
              </thead>
              <tbody>
                {banners
                  .filter(banner =>
                    banner.url_gambar
                      ? banner.url_gambar.toLowerCase().includes(searchInput.toLowerCase())
                      : false // Ensure banner.url_gambar is defined
                  )
                  .map((banner) => (
                    <tr key={banner.id}>
                      <td>
                        <img
                          src={banner.url_gambar}
                          alt={`Banner ${banner.id}`}
                          className="image-banner"
                        />
                      </td>
                      {adminData && adminData.level !== 'kepala desa' && (
                      <td>
                        <div style={{ display: "flex", justifyContent: "center" }}>
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
                            onClick={() => handleDeleteButtonClick(banner.id)}
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
                            onClick={() => handleEditButtonClick(banner)}
                          ></i>
                        </div>
                      </td>)}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {!showAddForm && !showEditForm && banners && banners.length === 0 && (
          <div>Tidak ada banner yang ditemukan.</div>
        )}
      </div>
    </div>
  );
}
