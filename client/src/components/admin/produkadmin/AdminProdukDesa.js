import React, { useState, useEffect } from "react";
import "./AdminProdukDesa.css"; // Import file CSS untuk styling

export default function AdminProdukDesa() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [produkList, setProdukList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [newProduk, setNewProduk] = useState({
    kategori_id: "",
    name: "",
    harga: "",
    foto: null,
    deskripsi: ""
  });
  const [editProduk, setEditProduk] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchProdukList();
    fetchKategoriList(); // Fetch categories when component mounts
  }, []);

  const fetchProdukList = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/produk");
      const responseData = await response.json();
      console.log("Data received:", responseData); // Check the structure of responseData
      if (Array.isArray(responseData.data)) {
        setProdukList(responseData.data);
      } else {
        console.error("Data received is not an array:", responseData.data);
      }
    } catch (error) {
      console.error("Error fetching produk:", error);
    }
  };

  const fetchKategoriList = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/kategori");
      const responseData = await response.json();
      console.log("Kategori Data received:", responseData); // Check the structure of responseData
      if (Array.isArray(responseData.data)) {
        setKategoriList(responseData.data);
      } else {
        console.error("Data received is not an array:", responseData.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddButtonClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleEditClick = (produk) => {
    setEditProduk(produk);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleCancelClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditProduk(null);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProduk({
      ...newProduk,
      foto: file
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("kategori_id", newProduk.kategori_id);
      formData.append("name", newProduk.name);
      formData.append("harga", newProduk.harga);
      formData.append("foto", newProduk.foto);
      formData.append("deskripsi", newProduk.deskripsi);

      const response = await fetch("http://127.0.0.1:5000/produk", {
        method: "POST",
        body: formData
      });
      const responseData = await response.json();
      console.log("New Product added:", responseData);
      fetchProdukList();
      setNewProduk({
        kategori_id: "",
        name: "",
        harga: "",
        foto: null,
        deskripsi: ""
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("kategori_id", editProduk.kategori_id);
      formData.append("name", editProduk.name);
      formData.append("harga", editProduk.harga);
      formData.append("foto", editProduk.foto);
      formData.append("deskripsi", editProduk.deskripsi);

      const response = await fetch(`http://127.0.0.1:5000/produk/${editProduk.id}`, {
        method: "PUT",
        body: formData
      });
      const responseData = await response.json();
      console.log("Product updated:", responseData);
      fetchProdukList();
      setEditProduk(null);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="admin-produk-container">
      <div className="title-admin-produk">
        <h1>Produk Desa</h1>
      </div>
      <div className="admin-produk-desa">
        {!showAddForm && !showEditForm && (
          <div className="toolbar">
            <span className="add-button" onClick={handleAddButtonClick}>
              <i className="fas fa-plus"></i>
              <p>Tambah Produk</p>
            </span>
            <div className="search">
              <label htmlFor="search">Search :</label>
              <input
                type="text"
                id="search"
                placeholder="Cari produk..."
                value={searchInput}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {showAddForm && (
          <form onSubmit={handleAddSubmit}>
            <h2>Tambah Produk</h2>
            <div className="form-group">
              <label htmlFor="kategori_id">Kategori Produk</label>
              <br></br>
              <select
                id="kategori_id"
                name="kategori_id"
                value={newProduk.kategori_id}
                onChange={handleInputChange}
              >
                <option value="">Pilih Kategori</option>
                {kategoriList.map((kategori) => (
                  <option key={kategori.id} value={kategori.id}>
                    {kategori.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="name">Nama Produk</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newProduk.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="harga">Harga</label>
              <input
                type="text"
                id="harga"
                name="harga"
                value={newProduk.harga}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="foto">Gambar</label>
              <input
                type="file"
                id="foto"
                name="foto"
                onChange={handleImageChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="deskripsi">Deskripsi</label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={newProduk.deskripsi}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button type="submit">Tambah</button>
            <button type="button" onClick={handleCancelClick}>Batal</button>
          </form>
        )}

        {showEditForm && editProduk && (
          <form onSubmit={handleEditSubmit}>
            <h2>Edit Produk</h2>
            <div className="form-group">
              <label htmlFor="kategori_id">Kategori Produk</label>
              <br></br>
              <select
                id="kategori_id"
                name="kategori_id"
                value={editProduk.kategori_id}
                onChange={(e) => setEditProduk({ ...editProduk, kategori_id: e.target.value })}
              >
                <option value="">Pilih Kategori</option>
                {kategoriList.map((kategori) => (
                  <option key={kategori.id} value={kategori.id}>
                    {kategori.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="name">Nama Produk</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editProduk.name}
                onChange={(e) => setEditProduk({ ...editProduk, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="harga">Harga</label>
              <input
                type="text"
                id="harga"
                name="harga"
                value={editProduk.harga}
                onChange={(e) => setEditProduk({ ...editProduk, harga: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="foto">Gambar</label> <br></br>
              <img src={editProduk.foto} alt={editProduk.name} style={{ maxWidth: "200px", marginBottom: "10px" }} />
              <input
                type="file"
                id="foto"
                name="foto"
                onChange={(e) => setEditProduk({ ...editProduk, foto: e.target.files[0] })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="deskripsi">Deskripsi</label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={editProduk.deskripsi}
                onChange={(e) => setEditProduk({ ...editProduk, deskripsi: e.target.value })}
              ></textarea>
            </div>
            <button type="submit">Simpan Perubahan</button>
            <button type="button" onClick={handleCancelClick}>Batal</button>
          </form>
        )}

        {!showAddForm && !showEditForm && (
          <table>
            <thead>
              <tr>
                <th>Kategori Produk</th>
                <th>Nama Produk</th>
                <th>Harga</th>
                <th>Gambar</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produkList
                .filter((produk) =>
                  produk.name.toLowerCase().includes(searchInput.toLowerCase())||produk.deskripsi.toLowerCase().includes(searchInput.toLowerCase())
                )
                .map((produk) => (
                  <tr key={produk.id}>
                    <td>
                      {kategoriList.find((kategori) => kategori.id === produk.kategori_id)?.name}
                    </td>
                    <td>{produk.name}</td>
                    <td>{produk.harga}</td>
                    <td>
                      <img src={produk.foto} alt={produk.name} />
                    </td>
                    <td>{produk.deskripsi}</td>
                    <td className="action-icons">
                      <i
                        className="fas fa-times"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          fontSize: "18px",
                          borderRadius: "3px",
                        }}
                      ></i>
                      <i className="fas fa-edit" onClick={() => handleEditClick(produk)}></i>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
