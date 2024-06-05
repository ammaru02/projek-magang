import React from "react";
import Navbar from "../header/Navbar";
import Banner from "../banner/Banner";
import BlogPost from "../blog/BlogPost";
import Struktur from "../struktur/Struktur";
import SejarahMap from "../sejarah/SejarahMap";
import Footer from "../footer/Footer";
// eslint-disable-next-line no-unused-vars
import StoreImage from "../StoreImage/StoreImage";

const Home = () => {
    return(
        <>
          <div className="page-container">
            <Navbar/>
            <Banner/>
            <BlogPost/>
            <Struktur/>
            <SejarahMap/>
            <Footer/>
          </div>
        </>
    );
}

export default Home;