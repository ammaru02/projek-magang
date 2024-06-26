/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import './Banner.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/banner");
                if (response.ok) {
                    const result = await response.json();
                    const sortedBanners = result.data.sort((a, b) => a.id - b.id); // Sort banners by id
                    setBanners(sortedBanners);
                } else {
                    console.error("Failed to fetch banners:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBanners();
    }, []);

    return (
        <Carousel className="main-carousel" showThumbs={false}>
            {banners.map((banner) => (
                <div key={banner.id}>
                    <img src={banner.url_gambar} height="500px" width="200px" />
                </div>
            ))}
        </Carousel>
    );
};

export default Banner;
