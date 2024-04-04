import React from "react";
import Navbar from "../header/Navbar";
import Banner from "../banner/Banner";
import BlogPost from "../blog/BlogPost";
import Struktur from "../struktur/Struktur";
import SejarahMap from "../sejarah/SejarahMap";

const Home = () => {
    return(
        <>
          <div className="container">
            <Navbar/>
            <div>
            <Banner/>
            <BlogPost/>
            <Struktur/>
            <SejarahMap/>
            </div>
          </div>
        </>
    );
}

export default Home;