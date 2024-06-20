import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminProdukDesa.css";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "./txtImgConfig";


export default function AdminProdukDesa() {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [newProductFoto, setNewProductFoto] = useState(null);
  const [produkList, setProdukList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [editKategori, setEditKategori] = useState(null);
  const [showEditKategoriForm, setShowEditKategoriForm] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddCategoriForm, setShowAddCategoriForm] = useState(false);
  const [showFormAddKategori , setShowFormAddKategori] = useState(false);
  const [newProduk, setNewProduk] = useState({
    kategori_id: "",
    name: "",
    harga: "",
    foto: "",
    deskripsi: "",
  });
  const [newKategori, setNewKategori] = useState({
    name: '',
    foto: null,
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
    fetchKategori();
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

  useEffect(() => {
    if (!showAddCategoriForm) {
      createPaginationDots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, produkList, itemsPerPage, showAddCategoriForm]);
 
  const fetchKategori = async () => {
    try {
      const response = await axios.get('http://localhost:5000/kategori');
      setKategoriList(response.data.data); // Update category list
    } catch (error) {
      console.error('Error fetching kategoris:', error);
    }
  };

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
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleAddCategoryButtonClick = () =>{
    setShowAddCategoriForm(true);
    setShowFormAddKategori(false);
  };

  const handleEditKategoriClick = (kategori) => {
    setEditKategori(kategori);
    setShowEditKategoriForm(true);
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleCancelClick = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowAddCategoriForm(false);
    setEditProduk(null);
    setShowEditSuccess(false);
    setNewKategori({ name: "", foto: null });
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

  const handleAddCategoriSubmit = async (event) => {
    event.preventDefault();

    try {
        const fotoRef = ref(storage, `images/kategori/${newKategori.foto.name}`);
        const uploadTask = uploadBytesResumable(fotoRef, newKategori.foto);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
                setUploading(true);
            },
            (error) => {
                console.error("Error uploading image:", error);
                alert('Gagal mengunggah foto kategori');
                setUploading(false);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log("Firebase download URL:", downloadURL);

                    const formData = {
                        name: newKategori.name,
                        foto: downloadURL,
                    };

                    const response = await axios.post('http://localhost:5000/kategori', formData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.status === 201) {
                        alert('Kategori berhasil ditambahkan');
                        fetchKategori();
                        setShowAddCategoriForm(false);
                        setNewKategori({ name: "", foto: null });
                    } else {
                        console.error(`Error: ${response.status} ${response.statusText}`);
                        alert(`Gagal menambahkan kategori: ${response.data.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('kategori sudah ada!');
                }

                setUploading(false);
            }
        );
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal mengunggah foto kategori');
        setUploading(false);
    }
};
  
const handleEditKategoriSubmit = async (event) => {
  event.preventDefault();
  if (!editKategori) return;

  try {
    let downloadURL = editKategori.foto;

    // Upload the new photo if a new file is selected
    if (editKategori.foto instanceof File) {
      const fotoRef = ref(storage, `images/kategori/${editKategori.foto.name}`);
      const uploadTask = uploadBytesResumable(fotoRef, editKategori.foto);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
            setUploading(true);
          },
          (error) => {
            console.error("Error uploading image:", error);
            alert('Gagal mengunggah foto kategori');
            setUploading(false);
            reject(error);
          },
          async () => {
            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });
    }

    // Prepare form data for the PUT request
    const formData = {
      name: editKategori.name,
      foto: downloadURL,
    };

    // Make the PUT request to update the category
    const response = await axios.put(`http://localhost:5000/kategori/${editKategori.id}`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check response status and handle accordingly
    if (response.status === 200) {
      alert('Kategori berhasil diperbarui');
      fetchKategori(); // Refresh category list after update
      setShowEditKategoriForm(false); // Close edit form
      setEditKategori(null); // Clear editKategori state
    } else {
      console.error(`Error: ${response.status} ${response.statusText}`);
      alert(`Gagal memperbarui kategori: ${response.data.message}`);
    }

    setUploading(false); // Set uploading state to false after request completes
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal memperbarui kategori');
    setUploading(false);
  }
};

const handleEditKategoriFotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditKategori({
        ...editKategori,
        foto: file,
        fotoPreview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }
};
  
const handleCancelEditKategori = () => {
  setEditKategori(null);
  setShowEditKategoriForm(false);
};

const handleDeleteKategoriClick = async (kategoriId) => {
  if (!window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
    return;
  }
  try {
    const response = await axios.delete(`http://localhost:5000/kategori/${kategoriId}`);
    if (response.status === 200) {
      alert('Kategori berhasil dihapus');
      fetchKategori(); // Metode untuk mengambil kembali kategori setelah penghapusan
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Tidak dapat menghapus kategori yang memiliki produk terkait. Hapus produk terlebih dahulu.');
  }
};

  const handleShowAddKategoriForm = () => {
    setShowFormAddKategori(true); 
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
  
    // Validasi form
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
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
  
          // POST request to add the product
          const response = await fetch("http://127.0.0.1:5000/produk", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
  
          const responseBody = await response.json();
  
          if (!response.ok) {
            console.error(
              `Server responded with ${response.status}: ${response.statusText}`
            );
            console.error("Response body:", responseBody);
  
            // Check if the error message indicates the product already exists in the same category
            if (responseBody.message && responseBody.message.includes("already exists in this category")) {
              alert("Produk sudah ada di kategori yang sama");
            }
          } else {
            console.log("New product added successfully.");
            alert("Produk berhasil ditambahkan");
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
  // eslint-disable-next-line no-unused-vars
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
        {!showAddForm && !showEditForm && !showAddCategoriForm && !showEditKategoriForm && (
          <div className="toolbar-produk">
            {adminData && adminData.level !== "kepala desa" && (
              <>
                <button className="add-button" onClick={handleAddButtonClick}>
                  <i className="fas fa-plus"></i>
                  <p>Tambah Produk</p>
                </button>
                <button className="show-button" onClick={handleAddCategoryButtonClick}>
                  <p>Lihat Kategori</p>
                </button>
              </>
            )}
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
        
        {/* Tabel Kategori */}
        {showAddCategoriForm && !showFormAddKategori && !showEditKategoriForm && (
          <div>
            <h2>Daftar Kategori</h2>
            <div className="toolbar-produk">
            {adminData && adminData.level !== "kepala desa" && (
              <>
                <button className="add-button" onClick={handleShowAddKategoriForm}>
                  <i className="fas fa-plus"></i>
                  <p>Tambah Kategori</p>
                </button>
              </>
            )}
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
            <table className="kategori-table">
              <thead>
                <tr>
                  <th>Nama Kategori</th>
                  <th>Foto</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kategoriList.map((kategori) => (
                  <tr key={kategori.id}>
                    <td>{kategori.name}</td>
                    <td>
                      <img src={kategori.foto} alt={kategori.name} style={{ width: "100px", height: "100px" }} />
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
                              onClick={() => handleDeleteKategoriClick(kategori.id)}
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
                              onClick={() => handleEditKategoriClick(kategori)} 
                            ></i>
                          </div>
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  
  {showAddCategoriForm && showFormAddKategori && (
            <form onSubmit={handleAddCategoriSubmit}>
                <h2>Tambah Kategori</h2>
                <br />
                <div className="form-group">
                    <label htmlFor="name">Nama Kategori</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newKategori.name}
                        onChange={(e) => setNewKategori({ ...newKategori, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="foto">Foto Kategori</label>
                    <input
                        type="file"
                        id="foto"
                        name="foto"
                        onChange={(e) => setNewKategori({ ...newKategori, foto: e.target.files[0] })}
                        required
                    />
                </div>
                <div className="button-row">
                    <button type="button" onClick={handleCancelClick}>
                        Batal
                    </button>
                    <button type="submit">Tambah</button>
                </div>
            </form>
        )}

        {showEditKategoriForm && editKategori && (
            <form onSubmit={handleEditKategoriSubmit}>
                <h2>Edit Kategori</h2>
                <div className="form-group">
                    <label htmlFor="editKategoriName">Nama Kategori</label>
                    <input
                        type="text"
                        id="editKategoriName"
                        name="editKategoriName"
                        value={editKategori.name}
                        onChange={(e) => setEditKategori({ ...editKategori, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="editKategoriFoto">Foto Kategori</label>
                    <input
                        type="file"
                        id="editKategoriFoto"
                        name="editKategoriFoto"
                        onChange={handleEditKategoriFotoChange}
                        required
                    />
                    {editKategori.foto && (
                        <img
                            src={editKategori.fotoPreview}
                            alt="Preview Foto"
                            style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
                        />
                    )}
                </div>
                <div className="button-row">
                    <button type="button" onClick={handleCancelEditKategori}>
                        Batal
                    </button>
                    <button type="submit">Simpan</button>
                </div>
            </form>
        )}
  
        {/* Form Tambah Produk */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit}>
            <h2>Tambah Produk</h2>
            <br />
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
            <div className="button-row">
              <button type="button" onClick={handleCancelClick}>
                Batal
              </button>
              <button type="submit">Tambah</button>
            </div>
          </form>
        )}
  
        {/* Form Edit Produk */}
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
            <div className="button-row">
              <button type="button" onClick={handleCancelClick}>
                Batal
              </button>
              <button type="submit">Simpan</button>
            </div>
          </form>
        )}
  
        {showEditSuccess && (
          <div className="edit-success-message">
            Produk berhasil diperbarui!
          </div>
        )}
  
        {!showAddForm && !showEditForm && !showEditSuccess && !showAddCategoriForm && (
          <div>
            <table className="produk-table">
              <thead>
                <tr>
                  <th>Kategori Produk</th>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Gambar</th>
                  <th>Deskripsi</th>
                  {adminData && adminData.level !== "kepala desa" && (
                    <th>Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {produkList
                  .filter(
                    (produk) =>
                      produk.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                      produk.deskripsi.toLowerCase().includes(searchInput.toLowerCase())
                  )
                  .sort((a, b) => b.id - a.id) // Urutkan berdasarkan ID produk terbaru ke atas
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) // Pagination logic
                  .map((produk) => (
                    <tr key={produk.id}>
                      <td className="kategori-produk-admin">
                        {kategoriList.find((kategori) => kategori.id === produk.kategori_id)?.name}
                      </td>
                      <td className="nama-produk-admin">{produk.name}</td>
                      <td>{formatPrice(produk.harga)}</td>
                      <td>
                        <img src={produk.foto} alt={produk.name} />
                      </td>
                      <td>{produk.deskripsi}</td>
                      {adminData && adminData.level !== "kepala desa" && (
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
                              onClick={() => handleDeleteClick(produk.id)}
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
                              onClick={() => handleEditClick(produk)}
                            ></i>
                          </div>
                        </td>
                      )}
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
