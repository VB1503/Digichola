import React from 'react'
import Autoslider from './Autoslider'
import { useNavigate } from 'react-router-dom'
import prof from '../images/VAS/Professional Branding.png'
import compIn from '../images/VAS/Comprehensive Information.png'
import intFea from '../images/VAS/Interactive Features.png'
import vishow from '../images/VAS/Visual Showcase.png'
import credtr from '../images/VAS/Credibility and Trust.png'
import enmark from '../images/VAS/Enhanced Marketing.png'
import evehost from '../images/VAS/Event hosting.png'
import moffer from '../images/VAS/Monetization  offer for FREE.png'
import JoinCard from './JoinCard'
import whatsapp from '../images/whatsapp.jpeg'
import zoom from '../images/zoom.png'
import '../styles/Vas.css'

const Vas = () => {

   const navigate = useNavigate();

   const services1 = [
    { title: "Professional Branding", image: prof },
    { title: "Comprehensive Information", image: compIn },
    { title: "Interactive Features", image: intFea },
    { title: "Visual Showcase", image: vishow },
    ];
    const services2 = [
        { title: "Credibility and Trust", image: credtr },
      { title: "Enhanced Marketing", image: enmark },
      { title: "Event hosting", image: evehost},
      { title: "Monetization / offer for FREE", image: moffer },
      ];
   return (
    <div className='Vas'>
        <h2 style={{textAlign:"left",fontSize:40}}>VAS</h2>
        <p className="dcqr-main">
        "VAS profiles speak louder than
words"
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

       <div className='cards'>
                <JoinCard tit="Cholas WhatsApp Group" subtit="Whatsapp" img={whatsapp} amt="FREE"/>
                <JoinCard tit="Cholas Weekly Meeting" subtit="Zoom" img={zoom} amt="₹1000"/>
       </div>


        <p className="quote">Empower Your Presence Digitally Today.</p>

        <div className="btns-primary">
        <button onClick={()=>navigate('/')} className="btn-primary">
                30 Days Free
        </button>
        <button onClick={()=>navigate('/abi')} className="btn-primary">
             Open VAS
        </button>
        </div>
    </div>
  )
}

export default Vas;