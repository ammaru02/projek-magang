import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./ArtikelAdmin.css";
import {
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "./txtImgConfig";

export default function ArtikelAdmin() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [adminData, setAdminData] = useState(null); 
    const [artikels, setArtikels] = useState([]);
    const [formData, setFormData] = useState({
        judul: "",
        tanggal: "",
        gambar: "",
        deskripsi: "",
    });
    const [artikelId, setArtikelId] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState("");

    useEffect(() => {
        fetchArtikels();
        fetchAdminData();
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
    const fetchArtikels = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/artikel");
            if (!response.ok) {
                throw new Error("Failed to fetch articles.");
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setArtikels(data);
            } else {
                console.error("Data received is not an array:", data);
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
            setError("Failed to fetch articles. Please try again later.");
        }
    };

    const handleAddButtonClick = () => {
        setShowAddForm(true);
        setFormData({
            judul: "",
            tanggal: "",
            gambar: "",
            deskripsi: "",
        });
    };

    const handleEditButtonClick = async (artikelId) => {
        setShowEditForm(true);
        const artikelToEdit = artikels.find((artikel) => artikel.id === artikelId);
        setArtikelId(artikelId);
        setFormData({
            judul: artikelToEdit.judul || "",
            tanggal: artikelToEdit.tanggal
                ? new Date(artikelToEdit.tanggal).toISOString().substr(0, 10)
                : "",
            gambar: artikelToEdit.foto || "",
            deskripsi: artikelToEdit.deskripsi || "",
        });

        // Jika foto adalah URL dari Firebase Storage, abaikan proses unggah
        if (!artikelToEdit.foto.startsWith("https://firebasestorage.googleapis.com")) {
            try {
                // Ambil file gambar dari URL
                const response = await fetch(artikelToEdit.foto);
                const blob = await response.blob();

                // Buat objek FormData untuk mengunggah file
                const formData = new FormData();
                formData.append("gambar", blob, artikelToEdit.foto);

                // Kirim permintaan POST ke endpoint server XAMPP untuk mengunggah gambar
                const uploadResponse = await fetch("http://127.0.0.1:80/upload.php", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image.");
                }

                console.log("Image uploaded successfully.");

                // Dapatkan URL lokal gambar setelah proses unggah selesai
                const downloadURL = `http://127.0.0.1:80/uploads/${artikelToEdit.foto}`;
                console.log("Local download URL:", downloadURL);

                // Perbarui formData dengan URL gambar yang baru diunggah
                setFormData({ ...formData, foto: downloadURL });

                // Perbarui data gambar di dalam database XAMPP
                const updateDataResponse = await fetch("http://127.0.0.1:5000/update-article", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        artikelId: artikelId,
                        foto: downloadURL, // Gunakan URL lokal gambar yang baru
                    }),
                });

                if (!updateDataResponse.ok) {
                    throw new Error("Failed to update article data.");
                }

                console.log("Article data updated successfully.");
            } catch (error) {
                console.error("Failed to upload image or update article data:", error);
            }
        }
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Jika ada perubahan pada gambar artikel, kirim permintaan PUT setelah foto terunggah
            if (formData.gambar instanceof File) {
                const fotoRef = ref(storage, `images/artikel/${artikelId}_${formData.gambar.name}`);
                const uploadTask = uploadBytesResumable(fotoRef, formData.gambar);

                // Menangani status perubahan unggah foto
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload progress: ", progress);
                    },
                    (error) => {
                        console.error("Error uploading image:", error);
                        setError("Failed to update article: " + error.message);
                    },
                    async () => {
                        // Dapatkan URL unduhan gambar setelah proses unggah selesai
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Firebase download URL:", downloadURL);
                        // Perbarui formData dengan URL gambar yang baru diunggah
                        setFormData({ ...formData, foto: downloadURL });

                        // Kirim permintaan PUT ke server XAMPP untuk memperbarui data artikel
                        const requestOptions = {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...formData, foto: downloadURL }), // Sertakan URL gambar yang baru
                        };
                        const response = await fetch(`http://127.0.0.1:5000/artikel/${artikelId}`, requestOptions);
                        if (!response.ok) {
                            throw new Error("Failed to update article.");
                        }
                        console.log("Article updated successfully.");

                        // Refresh halaman setelah berhasil edit
                        window.location.reload();
                    }
                );
            } else {
                // Jika tidak ada perubahan pada gambar artikel, kirim permintaan PUT langsung
                sendEditRequest();
            }
        } catch (error) {
            console.error("Error editing article:", error.message);
            setError("Failed to update article: " + error.message);
        }
    };

    // Fungsi untuk mengirim permintaan PUT ke server untuk mengedit artikel
    const sendEditRequest = async () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        };
        fetch(`http://127.0.0.1:5000/artikel/${artikelId}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update article.");
                }
                return response.json();
            })
            .then((data) => {
                window.location.reload(); // Refresh halaman setelah berhasil edit
            })
            .catch((error) => {
                console.error("Error editing article:", error.message);
                setError("Failed to update article: " + error.message); // Menyimpan pesan kesalahan ke state
            });
    };

    const handleAddFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Jika ada gambar yang diunggah, unggah ke Firebase Storage terlebih dahulu
            if (formData.gambar instanceof File) {
                const fotoRef = ref(storage, `images/artikel/${formData.gambar.name}`);
                const uploadTask = uploadBytesResumable(fotoRef, formData.gambar);

                // Menangani status perubahan unggah foto
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload progress: ", progress);
                    },
                    (error) => {
                        console.error("Error uploading image:", error);
                        setError("Failed to add article: " + error.message);
                    },
                    async () => {
                        // Dapatkan URL unduhan gambar setelah proses unggah selesai
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Firebase download URL:", downloadURL);

                        // Perbarui formData dengan URL gambar yang baru diunggah
                        const newFormData = { ...formData, foto: downloadURL };

                        // Kirim permintaan POST ke server XAMPP untuk menambahkan artikel
                        const requestOptions = {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(newFormData),
                        };
                        const response = await fetch("http://127.0.0.1:5000/artikel", requestOptions);
                        if (!response.ok) {
                            throw new Error("Failed to add article.");
                        }
                        console.log("Article added successfully.");

                        // Refresh halaman setelah berhasil tambah
                        window.location.reload();
                    }
                );
            } else {
                // Jika tidak ada gambar yang diunggah, kirim permintaan POST langsung
                sendAddRequest();
            }
        } catch (error) {
            console.error("Error adding article:", error.message);
            setError("Failed to add article: " + error.message);
        }
    };

    // Fungsi untuk mengirim permintaan POST ke server untuk menambah artikel
    const sendAddRequest = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        };
        fetch("http://127.0.0.1:5000/artikel", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add article.");
                }
                return response.json();
            })
            .then((data) => {
                window.location.reload(); // Refresh halaman setelah berhasil tambah
            })
            .catch((error) => {
                console.error("Error adding article:", error.message);
                setError("Failed to add article: " + error.message); // Menyimpan pesan kesalahan ke state
            });
    };

    const handleDeleteButtonClick = async (artikelId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
            try {
                const requestOptions = {
                    method: "DELETE",
                };
                const response = await fetch(`http://127.0.0.1:5000/artikel/${artikelId}`, requestOptions);
                if (!response.ok) {
                    throw new Error("Failed to delete article.");
                }
                console.log("Article deleted successfully.");

                // Refresh halaman setelah berhasil hapus
                window.location.reload();
            } catch (error) {
                console.error("Error deleting article:", error.message);
                setError("Failed to delete article: " + error.message); // Menyimpan pesan kesalahan ke state
            }
        }
    };

    const handleCancelClick = () => {
        setShowAddForm(false);
        setShowEditForm(false);
    };

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
                    <div className="toolbar-artikel">
                        {adminData && adminData.level !== 'kepala desa' && (
                        <button className="add-button" onClick={handleAddButtonClick}>
                            <i className="fas fa-plus"></i>
                            <p>Tambah Artikel</p>
                        </button>)}
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
                    <div className="form-add">
                        <form onSubmit={handleAddFormSubmit}>
                            <h2>Tambah Artikel</h2>
                            <br />
                            <div className="form-group">
                                <label htmlFor="judul">Judul Artikel</label>
                                <input
                                    type="text"
                                    id="judul"
                                    name="judul"
                                    value={formData.judul}
                                    onChange={(e) =>
                                        setFormData({ ...formData, judul: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tanggal">Tanggal</label>
                                <input
                                    type="date"
                                    id="tanggal"
                                    name="tanggal"
                                    value={formData.tanggal}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tanggal: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gambar">Gambar</label>
                                <input
                                    type="file"
                                    id="gambar"
                                    name="gambar"
                                    onChange={(e) =>
                                        setFormData({ ...formData, gambar: e.target.files[0] })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="deskripsi">Deskripsi</label>
                                <textarea
                                    id="deskripsi"
                                    name="deskripsi"
                                    value={formData.deskripsi}
                                    onChange={(e) =>
                                        setFormData({ ...formData, deskripsi: e.target.value })
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
                    </div>
                )}
                {showEditForm && (
                    <div className="form-edit">
                        <form onSubmit={handleEditFormSubmit}>
                            <h2>Edit Artikel</h2>
                            <br />
                            <div className="form-group">
                                <label htmlFor="judul">Judul Artikel</label>
                                <input
                                    type="text"
                                    id="judul"
                                    name="judul"
                                    value={formData.judul}
                                    onChange={(e) =>
                                        setFormData({ ...formData, judul: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tanggal">Tanggal</label>
                                <input
                                    type="date"
                                    id="tanggal"
                                    name="tanggal"
                                    value={formData.tanggal}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tanggal: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gambar">Gambar</label>
                                {formData.gambar && typeof formData.gambar === "string" && (
                                    <img
                                        src={formData.gambar}
                                        alt="Preview"
                                        style={{ maxWidth: "200px", marginTop: "10px" }}
                                    />
                                )}
                                <input
                                    type="file"
                                    id="gambar"
                                    name="gambar"
                                    onChange={(e) =>
                                        setFormData({ ...formData, gambar: e.target.files[0] })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="deskripsi">Deskripsi</label>
                                <textarea
                                    id="deskripsi"
                                    name="deskripsi"
                                    value={formData.deskripsi}
                                    onChange={(e) =>
                                        setFormData({ ...formData, deskripsi: e.target.value })
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
                    </div>
                )}
                {!showAddForm && !showEditForm && (
                    <div>
                        <table className="artikel-table">
                            <thead>
                                <tr>
                                    <th>Judul</th>
                                    <th>Tanggal</th>
                                    <th>Gambar</th>
                                    <th>Deskripsi</th>
                                    {adminData && adminData.level !== 'kepala desa' && (
                                    <th>Aksi</th>)}
                                </tr>
                            </thead>
                            <tbody>
    {artikels
        .filter((artikel) =>
            artikel.judul.toLowerCase().includes(searchInput.toLowerCase())
        )
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)) // Urutkan berdasarkan tanggal terbaru ke atas
        .map((artikel) => (
            <tr key={artikel.id}>
                <td className="judul">{artikel.judul}</td>
                <td className="tanggal">{artikel.tanggal}</td>
                <td>
                    <img
                        src={artikel.foto}
                        alt={artikel.judul}
                        className="image-artikel"
                    />
                </td>
                <td className="truncate-three-lines">{artikel.deskripsi}</td>
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
                            onClick={() => handleDeleteButtonClick(artikel.id)}
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
                            onClick={() => handleEditButtonClick(artikel.id)}
                        ></i>
                    </div>
                </td>)}
            </tr>
        ))}
</tbody>

                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
