/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import './Banner.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const Banner = () => {
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const storage = getStorage();
        const storageRef = ref(storage, 'images/'); // Ubah 'images' sesuai dengan path folder gambar di Firebase Storage

        // Mengambil daftar semua item di dalam folder 'images'
        listAll(storageRef)
            .then((res) => {
                // Mendapatkan URL download untuk setiap item
                const urls = res.items.map((itemRef) => getDownloadURL(itemRef));
                // Mengatur state imageUrls dengan array URL download
                Promise.all(urls)
                    .then((downloadURLs) => {
                        setImageUrls(downloadURLs);
                    })
                    .catch((error) => {
                        console.error("Error fetching download URLs:", error);
                    });
            })
            .catch((error) => {
                console.error("Error listing images:", error);
            });
    }, []);

    return (
        <Carousel className="main-carousel" showThumbs={false}>
            {imageUrls.map((imageUrl, index) => (
                <div key={index}>
                    <img src={imageUrl} height="500px" width="200px" />
                </div>
            ))}
        </Carousel>
    );
};

export default Banner;
