import React, { useState } from 'react';

import "./BannerAdmin.css";
export default function BannerAdmin() {
  const [showAddForm, setShowAddForm] = useState(false);  
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchInput, setSearchInput] = useState("");  

  const handleAddButtonClick = () =>{
    setShowAddForm(true);
  }
  
  const handleEditButtonClick = async () =>{
    setShowEditForm(true);
  }

  const handleAddFormSubmit = async (e) =>{
    e.preventDefault();
  }

  const handleEditFormSubmit = async (e) =>{
    e.preventDefault();
  }

  const handleDeleteButtonClick = async () =>{

  }

  const handleCancelClick = () =>{
    setShowAddForm(false);
    setShowEditForm(false);
  }

  const handleInputChange = (value) =>{
    setSearchInput(value)
  }

  return (
    <div className='admin-banner-container'>
        <div className='title-admin-banner'>
            <h1>Banner</h1>
        </div>
        <div className='admin-banner-list'>
        {!showAddForm && !showEditForm && (    
        <div className='toolbar-banner'>
            <button className="add-button" onClick={handleAddButtonClick}>
                <i className="fas fa-plus"></i>
                <p>Tambah Banner</p>
            </button>
            <div className="search">
                <input
                type="text"
                placeholder="Cari Artikel..."
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
                <br/>
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
            <br/>
            <div className="form-group">
                <label htmlFor="gambar">Gambar</label>
                <img
                src="#"
                alt="Preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
                />
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
        {!showAddForm && !showEditForm && (
        <div>
            <table className='banner-table'>
                <thead>
                    <tr>
                        <th>Gambar</th>
                        <th className='aksi'>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <img
                            src=""
                            alt=""
                            className="image-banner"
                        />
                    </td>
                    <td>
                    <div style={{ display: "flex", justifyContent: "center"}}>
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
                            onClick={() => handleDeleteButtonClick()}
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
                            onClick={() => handleEditButtonClick()}
                        ></i>
                    </div>
                </td>
                </tr>
                </tbody>
            </table>
        </div>
        )}
        </div>
    </div>
  )
}
