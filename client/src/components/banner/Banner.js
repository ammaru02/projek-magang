/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import './Banner.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchBannerUrls = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/banner");
                if (response.ok) {
                    const result = await response.json();
                    setImageUrls(result.data.map(banner => banner.url_gambar)); // Assuming the JSON response has a 'data' field with banner URLs
                } else {
                    console.error("Failed to fetch banners:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBannerUrls();
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
