import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FooterHome from './components/FooterHome';
import Header from './components/Header';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisH } from 'react-icons/fa';
import './Home.css'; // Assuming you have a CSS file for custom styles
import NewsCard from './components/NewsCards';
import Recents from './components/Recents';
import TopBusinesses from './components/TopBusinesses';
function Home() {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const [bannerData, setBannerData] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 700);
  const [parentIds, setParentIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannerRes = await axios.get(`${BACKEND_API_URL}/api/v1/auth/home-images/`);
        setBannerData(bannerRes.data);

        const categoryRes = await axios.get(`${BACKEND_API_URL}/search/categories`);
        const filteredCategories = categoryRes.data.filter(category => category.parent === null);
        setCategories(filteredCategories);
        setParentIds(categoryRes.data.map(category => category.parent)); // Store parent IDs
        setLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLargeScreen) {
        setCurrentBannerIndex(index => (index + 1) % bannerData.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerData, isLargeScreen]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsLargeScreen(screenWidth >= 700);

      let count;
      if (screenWidth >= 1280) {
        count = 24; // Large screens
      } else if (screenWidth >= 1024) {
        count = 16; // Medium screens
      } else if (screenWidth >= 768) {
        count = 12; // Small screens
      } else {
        count = 10; // Extra small screens (mobile)
      }
      setVisibleCategories(categories.slice(0, count));
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call the function initially

    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  const GotoCatlist = (catid, category) => {
    if (parentIds.includes(catid)) {
      navigate(`/category/${catid}/${category}`);
    } else {
      navigate(`/category/${category}`);
    }
  };

  const renderCategoryGrid = () => {
    if (loading) {
      return (
        <center className="w-full h-[30vh] flex flex-col items-center justify-center">
          <img src="/Circles-menu-3.gif" alt="loading" className='h-[30px] w-[30px]' />
        </center>
      );
    }

    if (categories.length === 0) {
      return <div>Server busy</div>;
    }

    const screenWidth = window.innerWidth;
    let displayedCategories = visibleCategories;
    if (screenWidth < 768) {
      const rowLimit = 4;
      const itemsPerRow = Math.floor(screenWidth / 80);
      displayedCategories = categories.slice(0, Math.min(categories.length, itemsPerRow * rowLimit - 2));
    } else if (screenWidth >= 800) {
      displayedCategories = categories.slice(0, 23);
    } else {
      displayedCategories = categories;
    }

    return (
      <div className="category-grid">
        {displayedCategories.map(category => (
          <div key={category.id} className="category-container" onClick={() => GotoCatlist(category.id, category.category)}>
            <div className="category-image">
              <img src={category.categoryImage} alt={category.category} />
            </div>
            <span className="category-name">{category.category}</span>
          </div>
        ))}
        {displayedCategories.length && (
          <div className="category-container more-button-container" onClick={() => navigate('/categories_list')}>
            <div className="category-image more-button">
              <FaEllipsisH className='rounded-full border md:w-10 md:h-10 md:p-2 border border-violet-700 sm:w-6 sm:h-6 p-1'/>
            </div>
            <span className="category-name">More</span>
          </div>
        )}
      </div>
    );
  };

  const renderBanners = () => {
    if (isLargeScreen) {
      return (
        <div className="banner-wrapper">
          {bannerData.map((banner, index) => (
            <div key={banner.id} className="banner-item">
              <img src={banner.home_image} alt={`Banner ${index + 1}`} />
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="relative max-w-[280px] h-[140px] rounded-lg flex mx-auto bg-slate-400 z-[-1]">
          {bannerData.length > 0 ? (
            bannerData.map((banner, index) => (
              <img
                key={banner.id}
                src={banner.home_image}
                alt={`Banner ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full rounded-lg transition-opacity object-cover ${
                  index === currentBannerIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          ) : (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg/1200px-Altja_j%C3%B5gi_Lahemaal.jpg"
              alt="Default Image"
              className="absolute top-0 left-0 w-full h-full rounded-lg transition-opacity object-cover opacity-100 animate-pulse"
            />
          )}
        </div>
      );
    }
  };

  return (
    <div>
      <Header />
      <div className='w-full mt-14'>
        {renderBanners()}
        <div className='mt-7'>
          {renderCategoryGrid()}
        </div>
        <TopBusinesses />
      <Recents />
      <NewsCard />
      <FooterHome />
      </div>
    </div>
  );
}

export default Home;
