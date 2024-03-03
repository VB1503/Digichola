import React from 'react'
import { useNavigate } from 'react-router-dom';
// import '../App.css';
import '../styles/Hero.css'

 const Hero = () => {
  const navigate = useNavigate();
  return (
    <div style={{textAlign:'center'}}>
        <div className='hero'>
            <h1 className='main-content1'> Your Gateway <br/> to District<br/> Success</h1>
            <h2 className='main-content2'> Sculpting brands<br/> nurturing network</h2>
        </div>
        <div className='btns'>
            <button className='main-btn1' onClick={()=>navigate('/abi')}>Abi Search</button>
            <button className='main-btn2'onClick={()=>navigate('/dcqr')}>Dc Qr Scanner</button>
            <button className='main-btn3' onClick={()=>navigate('/vas')}>Vas</button>
        </div>
        <p className='tag-line'>
          <div className='typing-word'>Digitally</div>
          <div className='typing-word'>Empowered</div>
          <div className='typing-word'>traditionally</div> 
          <div className='typing-word'>rooted</div></p>
    </div>
  )
}

export default Hero;