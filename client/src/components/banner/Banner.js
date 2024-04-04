/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import './Banner.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import image1 from '../image/Banner1.jpeg'
import image2 from '../image/Banner2.jpg'
import image3 from '../image/Banner3.jpg'
import image4 from '../image/Banner4.jpg'
import image5 from '../image/Banner5.jpg'


const Banner = ()=>{
    return(
        <>
        <Carousel className="main-carousel" showThumbs={false}>
                <div>
                    <img src={image1} height="500px" width="200px" />
                    
                </div>
                <div>
                    <img src={image2} height="500px" width="200px" />
                    
                </div>
                <div>
                    <img src={image3} height="500px" width="200px" />
                </div>
                <div>
                    <img src={image4} height="500px" width="200px" />
                </div>
                <div>
                    <img src={image5} height="500px" width="200px" />
                </div>
            </Carousel>
        </>
    )
}

export default Banner;