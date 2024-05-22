import React, { useState, useEffect } from 'react';
import './BlogPost.css';

const Blog = () => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [mainNews, setMainNews] = useState(null);
  const [sidebarNews, setSidebarNews] = useState([]);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetch('http://localhost:5000/artikel');
        const data = await response.json();
        if (Array.isArray(data)) {
          setMainNews(data[0]); // Set data utama dengan data pertama dari response
          setSidebarNews(data.slice(1)); // Set data sidebar dengan sisa data dari response
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };
  
    fetchNewsData();
  }, []);  

  const handleSidebarItemClick = (news) => {
    const clickedNewsIndex = sidebarNews.findIndex(item => item === news);
    const clickedNews = sidebarNews[clickedNewsIndex];
    const updatedSidebarNews = [...sidebarNews];
    updatedSidebarNews[clickedNewsIndex] = mainNews;
    setSidebarNews(updatedSidebarNews);
    setMainNews(clickedNews);
  };

  const toggleShowFullContent = () => {
    setShowFullContent(!showFullContent); // Toggle status tampilan deskripsi
  };

  const truncateDescription = (text) => {
    const words = text.split(' ');
    if (words.length > 100) {
      return words.slice(0, 100).join(' ') + '...';
    } else {
      return text;
    }
  };

  return (
    <div className='container-blog'>
      <div className="blog">
        <div className="main-content">
          {mainNews && (
            <div className="blog-post">
              <h2>{mainNews.judul}</h2>
              <p>Date: {mainNews.tanggal}</p>
              <img src={mainNews.foto} alt={mainNews.judul} />
              {showFullContent ? (
                <div className="full-description" dangerouslySetInnerHTML={{ __html: mainNews.deskripsi }} />
              ) : (
                <p className="short-description">{truncateDescription(mainNews.deskripsi)}</p>
              )}
              <button onClick={toggleShowFullContent} className='read-more-button1'>
                {showFullContent ? "Tutup" : "Baca Selengkapnya"}
              </button>
            </div>
          )}
        </div>
        <div className="sidebar">
          <ul>
            {sidebarNews.map((news, index) => (
              <li key={index} onClick={() => handleSidebarItemClick(news)}>
                <div className="recent-post-item">
                  <img className="sidebar-thumbnail" src={news.foto} alt={news.judul} />
                  <div className="sidebar-content">
                    <h3>{news.judul}</h3>
                    <p>{news.tanggal}</p>
                    <p className="truncate-text">{truncateDescription(news.deskripsi)}</p>
                    <button onClick={() => handleSidebarItemClick(news)} className='read-more-button2'>
                      Selengkapnya
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Blog;
