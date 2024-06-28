import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCardAlt from './NewsCardAlt';
// Replace with your New York Times API key
const API_KEY = import.meta.env.VITE_NEWS_KEY
const API_URL = `https://api.nytimes.com/svc/topstories/v2/business.json?api-key=${API_KEY}`;

const NewsCard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(API_URL);
        setArticles(response.data.results.slice(0, 12));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("An error occurred while fetching the news articles:", error);
        setFetchStatus(false);
      }
    };

    fetchNews();
  }, []);

  const renderSkeletons = () => (
    <div className="news-grid">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="news-card p-4 animate-pulse">
          <div className="bg-gray-300 h-48 w-full rounded-lg"></div>
          <div className="mt-4">
            <div className="bg-gray-300 h-6 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-300 h-4 w-full mb-1 rounded"></div>
            <div className="bg-gray-300 h-4 w-full mb-1 rounded"></div>
            <div className="bg-gray-300 h-4 w-full mb-1 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderArticles = () => {
    return (
      <div className="news-grid">
        {articles.map((article, index) => (
          <div key={index} className="news-card">
            <div className="news-image" style={{ backgroundImage: `url(${article.multimedia?.[0]?.url})` }}>
              {!article.multimedia && <div className="news-image-placeholder">No Image</div>}
            </div>
            <div className="news-content">
              <h2 className="news-title">{article.title}</h2>
              <p className="news-description">{article.abstract}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="show-more">Show More</a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {fetchStatus ? (
        <div className="news-container">
          <h4 className='md:text-[28px] font-bold md:my-4 text-[20px] sm:my-1 text-center md:text-left'>Business Articles</h4>
            {loading ? renderSkeletons() : renderArticles()}
        </div>
      ) : (
        <NewsCardAlt />
      )}
    </>
  );
};

export default NewsCard;
