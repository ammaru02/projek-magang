/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useRef } from 'react';
import './SejarahMap.css';

function SejarahMap() {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [description] = useState("Kota Tertua adalah sebuah kota yang kaya akan sejarah. Dibangun pada abad ke-10 oleh bangsa kuno, kota ini telah menjadi pusat perdagangan dan kebudayaan selama berabad-abad. Klik Baca Selengkapnya untuk melihat lebih banyak.djskkajdklsajkdjaskldhsakhdklsddsadjsakdlsjakldjskadjskajdksajdkjsakdjksajdlksjadklsjakldjlksajdklsjakdjskadjksajdksajdksajdkjsakdjsajdksajdksajdksjadkjskadjksajdsajdklsajdsjkladjskladjskadjskadjksadjksajdksjdksjakdsjakdjskdjksdjksadjkasdjkasldkasdjsklaSejak itu, dunia terus mengalami perubahan yang cepat dan mendalam dalam berbagai bidang. Revolusi Teknologi Informasi pada akhir abad ke-20 dan awal abad ke-21 telah mengubah cara kita berkomunikasi, bekerja, dan hidup. Internet, komputer, dan telepon pintar telah menjadi bagian tak terpisahkan dari kehidupan sehari-hari.Revolusi Teknologi Informasi pada akhir abad ke-20 dan awal abad ke-21 telah mengubah cara kita berkomunikasi, bekerja, dan hidup. Internet, komputer, dan telepon pintar telah menjadi bagian tak terpisahkan dari kehidupan sehari-hari.");

  const descriptionRef = useRef(null);
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
    if (descriptionRef.current) {
        descriptionRef.current.style.height = showFullDescription ? 'auto' : '300px'; // Setel tinggi deskripsi
      }
  };

  const buttonText = showFullDescription ? "Tutup" : "Baca Selengkapnya";

  const shortenDescription = (text, maxLength) => {
    if (!showFullDescription && text.length > maxLength) {
      return text.substr(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="card-sejarah">
      <div className="card-content">
        <div className="card-map">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19861.51728417338!2d119.53196943299139!3d-5.671034117847816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dca1fb4b9f0fbdd%3A0xc6cd728d6349d499!2sKassi%2C%20Rumbia%2C%20Jeneponto%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1631988141441!5m" width="600" height="450"  allowFullScreen="" loading="lazy"></iframe>
        </div>
        <div className="card-title-sejarah">
          <h1>Sejarah Desa</h1>
          <div className="card-description" ref={descriptionRef}>
            <p>
              {shortenDescription(description, 500)}
            </p>
            <button onClick={toggleDescription}>{buttonText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SejarahMap;
