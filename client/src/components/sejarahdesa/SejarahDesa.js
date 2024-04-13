import React from "react";
import './SejarahDesa.css';
import image1 from '../image/Banner1.jpeg';

const SejarahDesa = ()=>{
    return(
        <>
        <div className="container">
            <div className="page-sejarah">
                <i class="fa-solid fa-house"><p className="teks-icon">/ SEJARAH DESA</p></i>
                <h2 className="title-sejarah">SEJARAH DESA KASSI</h2>
            </div>
            <div className="sejarah-isi">
                <img src={image1} alt="sejarah" className="image-sejarah"/>
                <p className="sejarah-deskripsi">
                    Desa Kassi berada disebelah Utara Ibukota kecamatan Rumbia dengan jarak ± 11 Km dari Kota Kecamatan dan dengan jarak 34 Km dari Ibukota Kabupaten yang merupakan salah satu desa yang terletak di wilayah Kecamatan Rumbia, Kabupaten Jeneponto dengan luas wilayah ± 5,97 Km². Desa kassi terdiri dari 6 dusun yaitu Dusun Garege, Bonto Rannu, Bonto Maccini, Bonto Loe, Junggea dan Jenetallasa Adapun batas-batas wilayah Desa Kassi Kecamatan Rumbia adalah sebagai berikut:
                </p>
                <ul className="list-sejarah">
                    <li><p>Sebelah Utara berbatasan dengan Desa Loka</p></li>
                    <li><p>Sebelah Selatan berbatasan dengan Desa Pallantikang</p></li>
                    <li><p>Sebelah Timur berbatasan dengan Kabupaten Bantaeng</p></li>
                    <li><p>Sebelah Barat berbatasan dengan Desa Bonto Tiro</p></li>
                </ul>
                <p className="deskripsi">
                    Secure administrasi Desa Kassi terdiri dari enam (6) dusun yaitu Dusun yaitu Dusun Garege, Bonto Rannu, Bonto Maccini, Bonto Loe, Junggea dan Jenetallasa. Letak Dusun Garege, Bonto Rannu, Bonto Loe, Junggea, Bonto Maccini saling berdekatan sedangkan Dusun Jenetallasa terpisah dan berjauhan, jarak tempuh kedua dusun tersebut ± 2 Km yang sepanjang perjalanan dapat dilalui perkebunan sayuran (kol, seledri, buncis, sawi, wortel) dan tanaman hortikultura lainnya.
                </p>
            </div>
        </div>
        </>
    )
}

export default SejarahDesa;