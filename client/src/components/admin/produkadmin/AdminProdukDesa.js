import React, { useState, useEffect } from "react";
import "./AdminProdukDesa.css"; // Import file CSS untuk styling
import { storage, ref, uploadBytesResumable, getDownloadURL } from './txtImgConfig';

export default function AdminProdukDesa() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [newProductFoto, setNewProductFoto] = useState(null);
  const [produkList, setProdukList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [newProduk, setNewProduk] = useState({
    kategori_id: "",
    name: "",
    harga: "",
    foto: null,
    deskripsi: "",
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
    setShowEditSuccess(false);
  };

  const handleNewProductFotoChange = (event) => {
    setNewProductFoto(event.target.files[0]);
  };

  const handleCancelClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditProduk(null);
    setShowEditSuccess(false);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProduk({
      ...newProduk,
      foto: file,
    });
  };

// Hapus definisi variabel yang tidak digunakan
// const newProductFoto = ...
// const handleImageChange = ...
// const StoreImage = ...

const handleAddSubmit = async (event) => {
  event.preventDefault();
  try {
    if (editProduk && editProduk.foto instanceof File) {
      const fotoRef = ref(storage, `image/produk/${editProduk.foto.name}`);
      const uploadTask = uploadBytesResumable(fotoRef, editProduk.foto);
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          // Handle unsuccessful uploads
          console.error('Upload failed:', error);
        }, 
        async () => {
          // Define formData
          let formData = new FormData();

          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);

// Add the download URL to the form data
formData.append('foto', downloadURL);
formData.append('nama', editProduk.nama);
formData.append('deskripsi', editProduk.deskripsi);

// Send the form data to your server
try {
  const response = await fetch('http://your-server-url/your-endpoint', {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    console.error(`Server responded with ${response.status}: ${response.statusText}`);
    const responseBody = await response.json();
    console.error('Response body:', responseBody);
  } else {
    const responseBody = await response.json();
    console.log('New product added:', responseBody);
  }
} catch (error) {
  console.error('Failed to add product:', error);
}
        }
      );
    }
  } catch (error) {
    console.error('Failed to upload image:', error);
  }
};
  
  
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editProduk.foto instanceof File) {
        const fotoRef = ref(storage, `image/produk/${editProduk.foto.name}`);
        const uploadTask = uploadBytesResumable(fotoRef, editProduk.foto);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Tampilkan progress unggah jika diperlukan
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          () => {
            // Gambar baru berhasil diunggah, dapatkan URL gambar
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // Simpan perubahan pada produk bersama dengan URL gambar ke server Flask
              const updatedProduk = { ...editProduk, foto: downloadURL };
              fetch(`http://127.0.0.1:5000/produk/${editProduk.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduk),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Product updated:", data);
                  setShowEditForm(false);
                  setShowEditSuccess(true);
                })
                .catch((error) => {
                  console.error("Failed to update product:", error);
                });
            });
          }
        );
      } else {
        const response = await fetch(
          `http://127.0.0.1:5000/produk/${editProduk.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editProduk),
          }
        );
        if (!response.ok) {
          console.error(
            `Server responded with ${response.status}: ${response.statusText}`
          );
          const responseBody = await response.json();
          console.error("Response body:", responseBody);
        } else {
          const responseBody = await response.json();
          console.log("Product updated:", responseBody);
          setShowEditForm(false);
          setShowEditSuccess(true);
        }
      }
    } catch (error) {
      console.error("Failed to update product:", error);
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
                onChange={(e) =>
                  setNewProduk({ ...newProduk, kategori_id: e.target.value })
                }
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
                onChange={(e) =>
                  setNewProduk({ ...newProduk, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="harga">Harga</label>
              <input
                type="text"
                id="harga"
                name="harga"
                value={newProduk.harga}
                onChange={(e) =>
                  setNewProduk({ ...newProduk, harga: e.target.value })
                }
              />
            </div>
            <div className="form-group">
  <label htmlFor="foto">Foto Produk</label>
  <input type="file" id="foto" name="foto" onChange={handleNewProductFotoChange} />
</div>
            <div className="form-group">
              <label htmlFor="deskripsi">Deskripsi</label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={newProduk.deskripsi}
                onChange={(e) =>
                  setNewProduk({ ...newProduk, deskripsi: e.target.value })
                }
              ></textarea>
            </div>
            <button type="submit">Tambah</button>
            <button type="button" onClick={handleCancelClick}>
              Batal
            </button>
          </form>
        )}

        {showEditForm && editProduk && (
          <form onSubmit={handleEditSubmit}>
            <h2>Edit Produk</h2>
            <div className="form-group">
              <label htmlFor="kategori_id">Kategori Produk</label>
              <br />
              <select
                id="kategori_id"
                name="kategori_id"
                value={editProduk.kategori_id}
                onChange={(e) =>
                  setEditProduk({ ...editProduk, kategori_id: e.target.value })
                }
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
                onChange={(e) =>
                  setEditProduk({ ...editProduk, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="harga">Harga</label>
              <input
                type="text"
                id="harga"
                name="harga"
                value={editProduk.harga}
                onChange={(e) =>
                  setEditProduk({ ...editProduk, harga: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="foto">Gambar</label> <br />
              {editProduk.foto && (
                <img
                  src={editProduk.foto}
                  alt={editProduk.name}
                  style={{ maxWidth: "200px", marginBottom: "10px" }}
                />
              )}
              <input
                type="file"
                id="foto"
                name="foto"
                onChange={(e) =>
                  setEditProduk({ ...editProduk, foto: e.target.files[0] })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="deskripsi">Deskripsi</label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={editProduk.deskripsi}
                onChange={(e) =>
                  setEditProduk({ ...editProduk, deskripsi: e.target.value })
                }
              ></textarea>
            </div>
            <button type="submit">Simpan Perubahan</button>
            <button type="button" onClick={handleCancelClick}>
              Batal
            </button>
          </form>
        )}
        {showEditSuccess && (
          <div className="edit-success-message">
            Produk berhasil diperbarui!
          </div>
        )}
        {!showAddForm && !showEditForm && !showEditSuccess && (
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
                .filter(
                  (produk) =>
                    produk.name
                      .toLowerCase()
                      .includes(searchInput.toLowerCase()) ||
                    produk.deskripsi
                      .toLowerCase()
                      .includes(searchInput.toLowerCase())
                )
                .map((produk) => (
                  <tr key={produk.id}>
                    <td>
                      {
                        kategoriList.find(
                          (kategori) => kategori.id === produk.kategori_id
                        )?.name
                      }
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
                      <i
                        className="fas fa-edit"
                        onClick={() => handleEditClick(produk)}
                      ></i>
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
