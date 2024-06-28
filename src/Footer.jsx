import React, { useState, useEffect } from "react";
import { FaSearch, FaHome, FaHeart, FaAngleDoubleUp } from "react-icons/fa";
import { BiQrScan } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const [activeNavItem, setActiveNavItem] = useState(null);
  const navigate = useNavigate();
  const userid = localStorage.getItem('userid')
  const [notify, setNotify] = useState(18);

  const navigateTo = (path, navItem) => {
    navigate(path);
    setActiveNavItem(navItem);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="flex py-2 items-center justify-center gap-[8px] change-flex">
      <div className="search-nav-cont"> 
        <button onClick={() => navigateTo("/Explore", "search")} title="Search" className={`search-nav-btn ${
          activeNavItem === "search" ? "search-nav-bg" : ""
        }`}>
          <FaSearch className="text-white" />
        </button>
      </div>
      <div className="foot-nav-right">
        <span>
          <button onClick={() => navigateTo("/", "home")} title="Go To Home" className={`search-nav-icon ${
            activeNavItem === "home" ? "search-nav-bg" : ""
          }`}>
            <FaHome className="text-white" />
            {activeNavItem === "home" && (
              <div className="w-[4px] h-[4px] rounded-full bg-white"></div>
            )}
          </button>
        </span>
        <span>
          <button onClick={() => navigateTo("/DcScan", "qrReader")} title="Go To QR Scanner" className={`search-nav-icon ${
            activeNavItem === "qrReader" ? "search-nav-bg" : ""
          }`}>
            <BiQrScan className="text-white" />
            {activeNavItem === "qrReader" && (
              <div className="w-[4px] h-[4px] rounded-full bg-white"></div>
            )}
          </button>
        </span>
        {userid &&
        <span>
          <button onClick={() => navigateTo("/favourites/", "favorites")} title="Go To Favourites page" className={`search-nav-icon ${
            activeNavItem === "favorites" ? "search-nav-bg" : ""
          }`}>
            <FaHeart className="text-white" />
            {activeNavItem === "favorites" && (
              <div className="w-[4px] h-[4px] rounded-full bg-white"></div>
            )}
          </button>
        </span>
        }
          <span>
            <button onClick={scrollToTop} title="Go To Top" className={`search-nav-icon ${
              activeNavItem === "mail" ? "search-nav-bg" : ""
            }`}>
              <FaAngleDoubleUp className="text-white text-[24px]" />
            </button>
          </span>
      </div>
    </section>
  );
};

export default Footer;
