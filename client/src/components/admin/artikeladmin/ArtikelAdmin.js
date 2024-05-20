import React, { useState } from 'react';
import "./ArtikelAdmin.css";

export default function ArtikelAdmin() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const handleAddButtonClick = () => {
        setShowAddForm(true);
    }

    const handleEditButtonClick = () => {
        setShowEditForm(true);
    }

    const handleCancelClick = () => {
        setShowAddForm(false);
        setShowEditForm(false);
    }

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    return (
        <div className="admin-artikel-container">
            <div className="title-admin-artikel">
                <h1>Artikel</h1>
            </div>
            <div className="admin-artikel-list">
                {!showAddForm && !showEditForm && (
                    <div className="toolbar">
                        <button className="add-button" onClick={handleAddButtonClick}>
                            <i className="fas fa-plus"></i>
                            <p>Tambah Artikel</p>
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
                )}
                {showAddForm && (
                    <div className="form-tambah">
                        <form>
                            <h2>Tambah Artikel</h2>
                            <br/>
                            <div className="form-group">
                                <label htmlFor="judul">Judul Artikel</label>
                                <input type="text" id="judul" name="judul"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="tanggal">Tanggal</label>
                                <input type="date" id="tanggal" name="tanggal"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="gambar">Gambar</label>
                                <input type="file" id="gambar" name="gambar"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="deskripsi">Deskripsi</label>
                                <textarea id="deskripsi" name="deskripsi"></textarea>
                            </div>
                            <button type="submit">Tambah</button>
                            <button type="button" onClick={handleCancelClick}>Batal</button>
                        </form>
                    </div>
                )}
                {showEditForm && (
                    <div className="form-edit">
                        <form>
                            <h2>Edit Artikel</h2>
                            <br/>
                            <div className="form-group">
                                <label htmlFor="judul">Judul Artikel</label>
                                <input type="text" id="judul" name="judul"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="tanggal">Tanggal</label>
                                <input type="date" id="tanggal" name="tanggal"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="gambar">Gambar</label>
                                <input type="file" id="gambar" name="gambar"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="deskripsi">Deskripsi</label>
                                <textarea id="deskripsi" name="deskripsi"></textarea>
                            </div>
                            <button type="submit">Simpan</button>
                            <button type="button" onClick={handleCancelClick}>Batal</button>
                        </form>
                    </div>
                )}
                {!showAddForm && !showEditForm && (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Judul</th>
                                    <th>Tanggal</th>
                                    <th>Gambar</th>
                                    <th>Deskripsi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Judul Artikel 1</td>
                                    <td>2024-05-19</td>
                                    <td><img src="gambar.jpg" alt="Gambar Artikel"/></td>
                                    <td>Deskripsi Artikel 1</td>
                                    <td>
                                        <div style={{ display : "flex" }}>
                                            <i className="fas fa-times" style={{
                                                backgroundColor: "red",
                                                color: "white",
                                                fontSize: "15px",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                padding: "3px",
                                                marginRight: "5px",
                                                }} >
                                            </i>
                                            <i className="fas fa-edit" style={{
                                                color: "#000",
                                                fontSize: "20px",
                                                borderRadius: "3px",
                                                cursor: "pointer",
                                                marginRight: "5px",
                                                padding: "0",
                                                }} 
                                                onClick={handleEditButtonClick} >
                                            </i>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
