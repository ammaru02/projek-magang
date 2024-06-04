import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./AdminProdukDesa.css";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "./txtImgConfig";

export default function AdminProdukDesa() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [newProductFoto, setNewProductFoto] = useState(null);
  const [produkList, setProdukList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [adminData, setAdminData] = useState(null); 
  const [newProduk, setNewProduk] = useState({
    kategori_id: "",
    name: "",
    harga: "",
    foto: "",
    deskripsi: "",
  });
  const [editProduk, setEditProduk] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchProdukList();
    fetchKategoriList();
    createPaginationDots();
    fetchAdminData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showEditForm) {
      createPaginationDots();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, produkList, itemsPerPage, showEditForm]);

  useEffect(() => {
    if (!showAddForm) {
      createPaginationDots();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, produkList, itemsPerPage, showAddForm]);
  
  

  const createPaginationDots = () => {
    const paginationContainer = document.querySelector(".pagination-dots");
    paginationContainer.innerHTML = ""; // Bersihkan kontainer
  
    // Buat ulang tanda navigasi sesuai dengan jumlah halaman
    for (let i = 1; i <= Math.ceil(produkList.length / itemsPerPage); i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
  
      // Tambahkan kelas aktif jika halaman saat ini sama dengan halaman yang sedang diproses
      if (currentPage === i) {
        dot.classList.add("active");
      }
  
      // Tambahkan event listener untuk memanggil fungsi paginate
      dot.addEventListener("click", () => {
        paginate(i);
      });
  
      paginationContainer.appendChild(dot); // Tambahkan dot ke kontainer
    }
  };
  
  const fetchProdukList = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/produk");
      const responseData = await response.json();
      console.log("Produk list response data:", responseData);

      if (Array.isArray(responseData)) {
        setProdukList(responseData);
      } else if (Array.isArray(responseData.data)) {
        setProdukList(responseData.data);
      } else {
        console.error("Data received is not an array:", responseData.data);
      }
    } catch (error) {
      console.error("Error fetching produk:", error);
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

  const fetchKategoriList = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/kategori");
      const responseData = await response.json();
      console.log("Kategori list response data:", responseData);
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
    setShowEditSuccess(false);
  };

  const handleEditClick = (produk) => {
    setEditProduk(produk);
    setShowEditForm(true);
    setShowAddForm(false);
    setShowEditSuccess(false);
  };

  const handleNewProductFotoChange = (event) => {
    if (event.target.files.length > 0) {
      setNewProductFoto(event.target.files[0]);
    }
  };

  const handleCancelClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditProduk(null);
    setShowEditSuccess(false);
    setNewProductFoto(null);
    setNewProduk({
      kategori_id: "",
      name: "",
      harga: "",
      foto: "",
      deskripsi: "",
    }); 
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    if (
      !newProduk.name ||
      !newProductFoto ||
      !newProduk.kategori_id ||
      !newProduk.harga ||
      !newProduk.deskripsi
    ) {
      console.error("Please fill in all fields and select an image.");
      return;
    }

    try {
      // Upload the image to Firebase Storage
      const fotoRef = ref(storage, `images/produk/${newProductFoto.name}`);
      const uploadTask = uploadBytesResumable(fotoRef, newProductFoto);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Firebase download URL:", downloadURL);

          // Prepare the payload to send to the server
          const formData = {
            ...newProduk,
            foto: downloadURL,
          };

          const response = await fetch("http://127.0.0.1:5000/produk", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            console.error(
              `Server responded with ${response.status}: ${response.statusText}`
            );
            const responseBody = await response.json();
            console.error("Response body:", responseBody);
          } else {
            console.log("New product added successfully.");
            setNewProduk({
              kategori_id: "",
              name: "",
              harga: "",
              foto: "",
              deskripsi: "",
            });
            setNewProductFoto(null);
            fetchProdukList();
            setShowAddForm(false);
          }
        }
      );
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleDeleteClick = async (productId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/produk/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
        const responseBody = await response.text(); // Read the response body as text
        console.error("Response body:", responseBody);
        alert(`Failed to delete product: ${responseBody}`);
      } else {
        console.log("Product deleted successfully.");
        fetchProdukList(); // Refresh the product list after deletion
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("An error occurred while deleting the product. Please try again.");
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editProduk) {
      console.error("No product selected for editing.");
      return;
    }

    setUploading(true);

    if (editProduk.foto instanceof File) {
      const fotoRef = ref(storage, `images/produk/${editProduk.foto.name}`);
      const uploadTask = uploadBytesResumable(fotoRef, editProduk.foto);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const updatedProduk = { ...editProduk, foto: downloadURL };
          editProductOnServer(updatedProduk);
        }
      );
    } else {
      editProductOnServer(editProduk);
    }
  };

  const editProductOnServer = async (updatedProduk) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/produk/${updatedProduk.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduk),
        }
      );
      if (!response.ok) {
        console.error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
        const responseBody = await response.json();
        console.error("Response body:", responseBody);
      } else {
        console.log("Product updated successfully.");
        fetchProdukList();
        setShowEditForm(false);
        setShowEditSuccess(false);
        createPaginationDots(); // Update pagination dots
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = produkList
    .filter(
      (produk) =>
        produk.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        produk.deskripsi.toLowerCase().includes(searchInput.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-produk-container">
      <div className="title-admin-produk">
        <h1>Produk Desa</h1>
      </div>
      <div className="admin-produk-desa">
        {!showAddForm && !showEditForm && (
          <div className="toolbar-produk">
            {adminData && adminData.level !== 'kepala desa' && (
            <button className="add-button" onClick={handleAddButtonClick}>
              <i className="fas fa-plus"></i>
              <p>Tambah Produk</p>
            </button>)}
            <div className="search">
              <input
                type="text"
                placeholder="Cari Produk..."
                value={searchInput}
                onChange={handleInputChange}
              />
              <i className="fas fa-search"></i>
            </div>
          </div>
        )}
        <div className="form-tambah">
        {showAddForm && (
          <form onSubmit={handleAddSubmit}>
            <h2>Tambah Produk</h2>
            <br/>
            <div className="form-group">
              <label htmlFor="kategori_id">Kategori Produk</label>
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
              <input
                type="file"
                id="foto"
                name="foto"
                onChange={handleNewProductFotoChange}
              />
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
            {uploading && <progress value={uploadProgress} max="100" />}
            <button type="submit">Tambah</button>
            <button type="button" onClick={handleCancelClick}>
              Batal
            </button>
          </form>
        )}
        </div>
        {showEditForm && editProduk && (
          <form onSubmit={handleEditSubmit}>
            <h2>Edit Produk</h2>
            <div className="form-group">
              <label htmlFor="kategori_id">Kategori Produk</label>
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
              {editProduk.foto && typeof editProduk.foto === "string" && (
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
            <button type="submit">Simpan</button>
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
          <div>
            <table className="produk-table">
              <thead>
                <tr>
                  <th>Kategori Produk</th>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Gambar</th>
                  <th>Deskripsi</th>
                  {adminData && adminData.level !== 'kepala desa' && (
    <th>Aksi</th>
)}
                </tr>
              </thead>
              <tbody>
                {currentItems
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
                              marginRight: "5px",
                            }}
                            onClick={() => handleDeleteClick(produk.id)}
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
                            onClick={() => handleEditClick(produk)}
                          ></i>
                        </div>
                      </td>)}
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="pagination-dots">
              {Array.from({
                length: Math.ceil(produkList.length / itemsPerPage),
              }).map((_, index) => (
                <span
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
