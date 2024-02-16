import React from 'react';
import { socialMedia } from '../socialmediaDetails';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { useState } from 'react';
import { FooterLinks } from '../footerLinks';
import scrollup from '../images/scrollup.png';
import ContactUsForm from './contactForm';
export default function Footer() {
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  };
  
  return (
    <center className='footer'>
        <div className='scroll_top'>
          <img src={scrollup} onClick={scrollToTop} title='scroll to top' alt='#'></img>
        </div>
       <div className='footer-area'>
        <div className='footer-1'>
          <div className='foot-logos'>
          <Link to="/" ><img src={logo}  alt="logo"></img></Link>
          <Link to="/">Digichola</Link>
          </div>
            <div className='foot-link-cont'>
          {FooterLinks.map((footDetails, index) => (
            <ul className='foot-link-bar'>
              <li className='foot-link-head'>{footDetails.title}</li>
             {footDetails.sublink.map((subset, index)=>(
                  <li className='foot-link'><Link to={subset.link} onClick={scrollToTop}>{subset.title}</Link></li>
             ))}
            </ul>
          ))}
          <div>
          <button className="contact-button" onClick={toggleFormVisibility}><img src='https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_256px.png' width={'20px'} alt='#'></img> Mail Us</button>
          <ContactUsForm isFormVisible={isFormVisible} toggleFormVisibility={toggleFormVisibility} />
          </div>
          </div>
          

        </div>
        <div className='footer-2'>
          <div className='social-medias'>
          {socialMedia.map((object,index) =>(
             <a href={object.link} target='__blank'><img src={object.image}  alt={index} className='social-logo'></img></a>
             ))}
             </div>
            <div className='legal'>
              <Link to="terms_of_service" onClick={scrollToTop}>&#x2022; Terms Of Service</Link>
              <Link to="privacy_policy" onClick={scrollToTop}>&#x2022; Privacy Policy</Link>
            </div>
            <div><p>Copyright &#169; 2024</p></div>
        </div>
       </div>
    </center>
  )
}
