import React from "react";
import Navbar from "../header/Navbar";
import Banner from "../banner/Banner";
import BlogPost from "../blog/BlogPost";
import Struktur from "../struktur/Struktur";
import SejarahMap from "../sejarah/SejarahMap";
import Footer from "../footer/Footer";

const Home = () => {
    return(
        <>
          <div className="page-container">
            <Navbar/>
            <div>
            <Banner/>
            <BlogPost/>
            <Struktur/>
            <SejarahMap/>
            <Footer/>
            </div>
          </div>
        </>
    );
}

export default Home;