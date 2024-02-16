import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Images } from "../components/Data";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

function Carousel() {
  return (
    <div className=''>
    <div className="container mx-auto">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="swiper_container"
      >
         {Images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image.image} alt={`slide_image_${index + 1}`} />
          </SwiperSlide>
        ))}

    
      </Swiper>
    </div>
    </div>
  );
}

export default Carousel;
