import React from 'react'
import Autoslider from './Autoslider'
import { useNavigate } from 'react-router-dom';
import conv from '../images/dcqr/convinience.png';
import Acc from '../images/dcqr/Accurate information.png';
import intExp from '../images/dcqr/Interactive Experience.png';
import trs from '../images/dcqr/trust_and_security.png';
import evfrd from '../images/dcqr/Environment friendly.png';
import mob from '../images/dcqr/Integration with mobile devices.png';
import promo from '../images/dcqr/promotion _offers.png';
import conexp from '../images/dcqr/contactless_experience.png';
import '../styles/Dcqrscanner.css'

const DCQRScanner = () => {
    const services1 = [
    { title: "Convenience", image: conv },
    { title: "Accurate Information", image: Acc },
    { title: "Interactive Experience", image: intExp },
    { title: "Trust and Security", image: trs },
    ];
    const services2 = [
      { title: "Environmentally friendly", image: evfrd },
      { title: "Integration with Mobile Devices", image: mob },
      { title: "Promotion and Offers", image: promo},
      { title: "Contactless Experience", image: conexp },
      ];

    const navigate = useNavigate();
  return (
    <div className='dcqr'>
        <h2 className='heading'>DC QR SCANNER</h2>
         <p className="dcqr-main">
        "Elevate your business with <br/>Digichola QR service"
        </p>
        <Autoslider/>
        <div className='services'>
          <div className="services-list1">
            {services1.map((i) => (
              <div style={{ display: "flex",padding:8 }}>
                <img src={i.image} alt={i.title} className="list-style-img" />
                <span className="list-style-name">{i.title}</span>
              </div>
            ))}
          </div>
          <div className="services-list1">
            {services2.map((i) => (
              <div style={{ display: "flex",padding:8 }}>
                <img src={i.image} alt={i.title} className="list-style-img" />
                <span className="list-style-name">{i.title}</span>
              </div>
            ))}
          </div>
        </div>


        <p className="quote">Scan to see verified business profiles</p>

        <div className="btns-primary">
        <button onClick={()=>navigate('/')} className="btn-primary">
                open Scanner
        </button>
        <button onClick={()=>navigate('/abi')} className="btn-primary">
             register now
        </button>
        </div>
        
    </div>
  )
}

export default DCQRScanner