import React, { useState, useRef } from 'react';
import image1 from '../image/wisata.png';
import image2 from '../image/agro.png';
import image3 from '../image/umkm.jpg';
import './KeunggulanComp.css';

const KeunggulanComp = () => {
    const [showFullDescription, setShowFullDescription] = useState([false, false, false]);

    const descriptions = [
        "Desa wisata memiliki sejumlah keunggulan yang membuatnya menonjol dalam industri pariwisata. Salah satunya adalah keaslian budaya dan tradisi lokal yang masih dijaga dengan baik. Di desa wisata, pengunjung dapat terlibat langsung dalam kegiatan tradisional seperti pertanian, kerajinan tangan, atau upacara adat, memberi mereka pengalaman yang otentik tentang kehidupan masyarakat setempat. Selain itu, desa wisata juga menawarkan kesejukan dan keindahan alam yang memukau, mulai dari pegunungan yang hijau hingga sungai yang jernih. Pengunjung dapat menikmati udara segar, pemandangan menakjubkan, dan berbagai aktivitas alam seperti trekking, bersepeda, atau berenang. Keramahan dan keterlibatan komunitas juga menjadi daya tarik tersendiri. Desa-desa ini sering dikelola oleh komunitas lokal yang ramah, yang dengan senang hati berbagi cerita dan tradisi mereka dengan pengunjung, menciptakan ikatan emosional yang kuat. Makanan lokal yang autentik juga menjadi daya tarik utama, menawarkan pengalaman kuliner yang unik yang mencerminkan kekayaan budaya setempat. Selain itu, desa wisata menawarkan berbagai kegiatan wisata berbasis pengalaman, seperti pelatihan kerajinan tangan tradisional atau memasak bersama, yang memungkinkan pengunjung merasakan kehidupan dan budaya lokal secara langsung. Dalam hal pelestarian lingkungan, desa wisata sering kali menjadi teladan dengan menerapkan praktik berkelanjutan dalam pengelolaan wisata, seperti penggunaan energi terbarukan dan manajemen sampah yang baik. Pendapatan dari pariwisata juga digunakan untuk meningkatkan kesejahteraan komunitas lokal melalui pembangunan ekonomi, pendidikan, kesehatan, dan infrastruktur dasar, menciptakan lingkungan yang harmonis antara wisatawan dan penduduk lokal.",
        "Desa dengan keunggulan di bidang agrowisata menawarkan pengalaman unik yang menggabungkan keindahan alam dengan kegiatan pertanian dan kebun. Salah satu keunggulan utamanya adalah kedekatan dengan alam, di mana wisatawan dapat menikmati udara segar, pemandangan hijau, dan suasana yang tenang. Selain itu, desa agrowisata juga memungkinkan wisatawan untuk terlibat langsung dalam kegiatan pertanian, mulai dari menanam, merawat, hingga memanen berbagai jenis tanaman. Ini memberi pengalaman belajar yang berharga tentang proses pertanian tradisional dan pentingnya menjaga kelestarian lingkungan. Keunggulan lainnya adalah variasi produk pertanian lokal yang beragam. Desa agrowisata sering kali menawarkan berbagai produk segar seperti buah-buahan, sayuran, rempah-rempah, dan produk olahan lainnya. Wisatawan dapat menikmati berbagai hidangan lezat yang disiapkan menggunakan bahan-bahan lokal yang segar dan berkualitas tinggi. Selain itu, wisatawan juga memiliki kesempatan untuk membeli produk-produk tersebut sebagai oleh-oleh yang autentik dan berkualitas dari desa tersebut.",
        "Desa agrowisata dengan keunggulan di bidang UMKM (Usaha Mikro, Kecil, dan Menengah) menawarkan pengalaman yang unik dengan menggabungkan pariwisata dengan promosi dan penjualan produk-produk lokal. Salah satu keunggulan utamanya adalah kemampuan desa untuk mengembangkan UMKM lokal yang beragam dan berkualitas tinggi. Wisatawan dapat menjelajahi pasar atau galeri yang menampilkan berbagai produk UMKM, mulai dari kerajinan tangan, makanan lokal, tekstil, hingga produk-produk seni yang unik. Desa agrowisata juga memberikan kesempatan bagi pengusaha UMKM lokal untuk memperluas jangkauan pasar mereka. Dengan adanya wisatawan yang berkunjung, UMKM dapat memperkenalkan produk-produk mereka kepada audiens yang lebih luas dan meningkatkan penjualan mereka. Ini menciptakan dorongan ekonomi yang positif di desa tersebut, membantu meningkatkan pendapatan masyarakat setempat dan memberdayakan pengusaha lokal."
    ];

    const images = [image1,image2,image3];

    const descriptionRefs = [useRef(null), useRef(null), useRef(null)];

    const toggleDescription = (index) => {
        setShowFullDescription(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const buttonTexts = ["Baca Selengkapnya", "Baca Selengkapnya", "Baca Selengkapnya"];

    return (
        <div className='container-sm'>
            <div className="page-keunggulan">
                <i className="fa-solid fa-house"><p className="teks-icon">/ KEUNGGULAN DESA</p></i>
                <h2 className="title-keunggulan">KEUNGGULAN DESA KASSI</h2>
            </div>
            {[0, 1, 2].map(index => (
                <div className={`card-keunggulan${index + 1}`} key={index}>
                    <div className="card-content">
                        <div className="card-map">
                            <img src={images[index]} alt={`Keunggulan ${index + 1}`} />
                        </div>
                        <div className="card-description" ref={descriptionRefs[index]} style={{ height: showFullDescription[index] ? 'auto' : '100px' }}>
                            <p>
                                {showFullDescription[index] ? descriptions[index] : descriptions[index].substring(0, 500) + "..."}
                            </p>
                            <button onClick={() => toggleDescription(index)}>{buttonTexts[index]}</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default KeunggulanComp;
