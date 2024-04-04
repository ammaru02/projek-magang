import React, { useState } from 'react';
import './BlogPost.css';

const Blog = () => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState({});

const handleReadMoreDescription = (index) => {
    setShowFullDescription(prevState => ({
        ...prevState,
        [index]: !prevState[index] !== undefined ? !prevState[index] : true
    }));
};

  const currentNews = [
    {
      title: "DESA KASSI TAWARKAN WISATA ALAM DAN AGRO",
      date: "March 27, 2024",
      image: require("../image/Banner2.jpg"),
      description: "Wakil Bupati Jeneponto Paris Yasir mengatakan, Desa Wisata Kassi memiliki keunggulan berupa daya tarik agrowisata sekaligus edukasi bercocok ...",
      content: "<p>Tanam jkdajdlksjkadjsadhjsahfsb fn kjdshfkdksadsabdjsa csadnsndksa</p>"
    }
    // tambahkan data lain jika diperlukan
  ];

  const recentPosts = [
    { 
      title: "Judul Pertama",
      date: "March 27, 2024",
      description: "Ini penjelasan singkat tentang hdjsadksjak dsjkjdksajd dsajdklsajdlkas",
      image: require("../image/Banner1.jpeg"),
      
    },
    { 
      title: "Judul Kedua",
      date: "Januari 27, 2024",
      description: "Ini penjelasan singkat tentang hdsjhdskjadlksajlk dsjadklsjadjska dsadskladjsakld ndsaklksadjask dskajdlsdjas   ",
      image: require("../image/Banner4.jpg"),
      
    },
    { 
      title: "Judul Ketiga",
      date: "Januari 27, 2024",
      description: "Ini penjelasan singkat tentang",
      image: require("../image/Banner5.jpg"),
      
    }
    // tambahkan data lain jika diperlukan
  ];

  return (
        <div className='container-blog'>
            <div className="blog">
            <div className="main-content">
                {currentNews.map((news, index) => (
                <div className="blog-post" key={index}>
                    <h2>{news.title}</h2>
                    <p>Date: {news.date}</p>
                    <img src={news.image} alt={news.title} />
                    {showFullContent ? (
                    <div dangerouslySetInnerHTML={{ __html: news.content }} />
                    ) : (
                    <p>{news.description}</p>
                    )}
                    <button onClick={() => setShowFullContent(!showFullContent)} className='read-more-button'>
                    {showFullContent ? "Tutup" : "Baca Selengkapnya"}
                    </button>
                </div>
                ))}
            </div>
            <div className="sidebar">
                {/* <h2>Recent Posts</h2> */}
                <ul>
                {recentPosts.map((post, index) => (
                    <li key={index}>
                    <div className="recent-post-item">
                        <img src={post.image} alt={post.title} />
                        <div>
                        <h3>{post.title}</h3>
                        <p>{post.date}</p>
                        {showFullDescription ? (
                            <p className={showFullDescription[index] ? 'show-full-text' : 'truncate-text'}>{post.description}</p>
                        ) : (
                            <p>{post.description.substring(0, 50)}......</p>
                        )}
                        <button onClick={() => handleReadMoreDescription(index)} className='read-more-button'>
                            {showFullDescription[index] ? "Tutup" : "Baca Selengkapnya"}
                        </button>
                        </div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </li>
                ))}
                </ul>
            </div>
            </div>
        </div>
  );
}

export default Blog;
