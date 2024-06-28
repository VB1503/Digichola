import React,{useState} from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Footer.css'; // Assuming you will create a CSS file for the footer styles
import ContactUs from './Contactus';
function FooterHome() {
    const [showContactUs, setShowContactUs] = useState(false);
    const toggleContactUsModal = () => {
        setShowContactUs(!showContactUs);
      };
  return (
    <footer className="footer">
        <ContactUs showModal={showContactUs} onClose={toggleContactUsModal} />
      <div className="footer-container">
        <div className="footer-section">
          <h2 ><img src="https://res.cloudinary.com/dybwn1q6h/image/upload/v1715572132/favicon_tmeqwo.png" alt="👑" className='inline mr-2 w-[28px] h-[28px]'/>Digichola</h2>
          <p>Your trusted partner in digital transformation.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/Explore">Explore</a></li>
            <li><a href="/DcScan">Scan QR Code</a></li>
            <li><a href="/favourities">Favourites</a></li>
            <li><a onClick={toggleContactUsModal}>Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: digichola@gmail.com</p>
          <p>Phone: +91 93802 02217</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" className=''><FaFacebook /></a>
            <a href="https://www.twitter.com"><FaTwitter /></a>
            <a href="https://www.linkedin.com"><FaLinkedin /></a>
            <a href="https://www.instagram.com"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Digichola. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterHome;
