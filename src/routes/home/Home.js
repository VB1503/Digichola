import React from 'react'
import Carousel from './components/Carousel';
import './styles/carousel.css';
function Home() {
  return (
    <div className='homePage min-h-[200vh]'>
     <Carousel />
    </div>
  )
}

export default Home