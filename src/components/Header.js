import React from "react"
import Navbar from './Navbar';
import { useState, useEffect } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { Link } from 'react-router-dom';
import logo from "../images/logo.png"

const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const closeMenu =() => setOpen(false);
 
  const [prevScrollpos, setPrevScrollpos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll animation
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const shouldShowNavbar = prevScrollpos > currentScrollPos || currentScrollPos === 0;

      setPrevScrollpos(currentScrollPos);
      setVisible(shouldShowNavbar);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollpos]);
  return (
    <center className={isOpen ? 'header active' : 'header'} style={{ position: 'fixed', top: visible ? '0' : '-700px', transition: 'top 0.3s' }}>
      <div className={isOpen ? 'nav-area active' : 'nav-area'}>
      <Link to="/" className="logo-copy" onClick={() =>{closeMenu(); scrollToTop();}}>
          Digichola
        </Link>
        <div className="app-logo" onClick={() =>{closeMenu(); scrollToTop();}}><Link to="/"><img src={logo}  alt="logo"></img></Link></div>
        <Link to="/" className="logo"  onClick={() =>{closeMenu(); scrollToTop();}}>
          Digichola
        </Link>
        <div className={isOpen ? 'nav-icons active' : 'nav-icons'}>
            <Hamburger toggled={isOpen} size={20} toggle={setOpen} />
        </div>
        <div className="menubar-flex"> <Navbar isOpen={isOpen} closeMenu={closeMenu} /></div>
      <div className="button-desk">
           <Link to={"/login"} className={isOpen ? 'login active' : 'login'}>Log in</Link>
           <button className={isOpen ? 'start_for_free active text-black' : 'start_for_free text-black'}>Start for free</button>
      </div>
      </div>
    </center>
  );
};

export default Header;
