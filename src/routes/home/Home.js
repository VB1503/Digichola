import React from 'react'
import Carousel from './components/Carousel';
import Content from "./components/Content";
import DCQRScanner from "./components/DCQRScanner";
import Hero from "./components/Hero";
import Overview from "./components/Overview";
import Vas from "./components/Vas";
import './styles/carousel.css';
function Home() {
  return (
    <div className='homePage min-h-[200vh]'>
      <Hero/>
      <Carousel />
      <Overview/>
      <DCQRScanner/>
      <Vas/>
      <Content/>
    </div>
  )
}

export default Home