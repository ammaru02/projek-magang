import React from "react";
import './VisimisiStruktur.css'
import image1 from '../image/Banner1.jpeg'

const VisimisiStruktu = ()=>{
    return(
        <>
            <div className="container">
                <div className="page-visimisi">
                    <i class="fa-solid fa-house"><p className="teks-icon">/ Visi Misi & Struktur Desa</p></i>
                    <h2 className="title-visimisi">VISI MISI DESA KASSI</h2>
                </div>
                <div className="visimisi-isi">
                    <h3>Visi</h3>
                    <p className="deskripsi-visimisi">
                    Terwujudnya ekonomi kerakyatan yang tangguh, inovatif, dan berkeadilan berbasis pelayanan prima pemerintah desa kassi dan partisipasi masyarakat
                    </p>
                </div>
                <div className="visimisi-isi">
                    <h3>Misi</h3>
                    <ol className="list-misi">
                        <li><p>Meningkatkan sumber daya aparatur pemerintah dan masyarakat untuk meningkatkan kapasitas dan kapabilitas aparatur dan meningkatkan kualitas hidup masyarakat</p></li>
                        <li><p>Meningkatkan kulaitas pelayanan aparatur desa di desa</p></li>
                        <li><p>Membangun kemandirian ekonomi masyarakat yang bertumpu pada potensi lokal</p></li>
                        <li><p>Meningkatkan ekonomi masyarakat dengan mengoptimalkan pengelolaan sumber daya lokal secara berkelanjutan</p></li>
                        <li><p>Meningkatkan kelembagaan masyarakat desa</p></li>
                    </ol>
                </div>
                <div className="page-struktur">
                    <h2 className="title-struktur">STRUKTUR DESA KASSI</h2>
                    <img src={image1} alt="struktur" className="image-struktur"/>
                </div>
            </div>
        </>
    )
}

export default VisimisiStruktu;