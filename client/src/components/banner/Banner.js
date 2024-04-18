/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import './Banner.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


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