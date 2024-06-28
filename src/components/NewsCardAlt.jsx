import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCardAlt from './NewsCardAlt';

// Using a public proxy server to bypass CORS issues
const PROXY_URL = 'https://api.allorigins.win/get?url=';
const GOOGLE_NEWS_RSS_URL = 'https://news.google.com/rss/search?q=business&hl=en-US&gl=US&ceid=US:en';

const NewsCard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${PROXY_URL}${encodeURIComponent(GOOGLE_NEWS_RSS_URL)}`);
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data.contents, 'application/xml');
        const items = xml.querySelectorAll('item');

        const parsedArticles = Array.from(items).map(item => {
          const title = item.querySelector('title').textContent;
          const description = item.querySelector('description').textContent;
          const url = item.querySelector('link').textContent;
          
          return {
            title,
            description: description.replace(/<[^>]*>/g, ''), // Removing HTML tags
            url,
          };
        });

        setArticles(parsedArticles.slice(0, 12)); // Limit to 12 articles (3 rows, 4 columns)
        setLoading(false);
      } catch (error) {
        console.error("An error occurred while fetching the news articles:", error);
        setLoading(false);
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
            <div className="news-content">
              <h2 className="news-title">{article.title}</h2>
              <p className="news-description">{article.description}</p>
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
          <h4 className="md:text-[28px] font-bold md:my-4 text-[20px] sm:my-1 text-center md:text-left">Business Articles</h4>
          {loading ? renderSkeletons() : renderArticles()}
        </div>
      ) : (
        <NewsCardAlt />
      )}
    </>
  );
};

export default NewsCard;
