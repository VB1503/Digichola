import { useEffect, useState, useRef } from "react";
import "../Carousel.css";
import { FaTimes } from "react-icons/fa";

function Carousel({ images, closeCarousel, carouselName }) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  let timeOut = null;

  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (autoPlay) {
      timeOut = setTimeout(() => {
        slideRight();
      }, 5000);
    }
    return () => clearTimeout(timeOut);
  }, [current, autoPlay]);

  const slideRight = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  const slideLeft = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    if (touchStartX.current - touchEndX.current > 50) {
      slideRight();
    } else if (touchEndX.current - touchStartX.current > 50) {
      slideLeft();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onMouseEnter={() => {
        setAutoPlay(false);
        clearTimeout(timeOut);
      }}
      onMouseLeave={() => {
        setAutoPlay(true);
      }}
    >
      <FaTimes className="absolute top-5 right-5 text-[24px] text-white " onClick={closeCarousel} />
      <div
        className="carousel relative bg-white rounded-lg shadow-lg overflow-hidden"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel_wrapper">
          {images.map((image, index) => (
            <div
              key={index}
              className={
                index === current
                  ? "carousel_card carousel_card-active"
                  : "carousel_card"
              }
            >
              {carouselName === "gallery" ? (
                <img className="card_image" src={image.galary_photo} alt={`slide-${index}`} />
              ) : (
                <img className="card_image" src={image.poster} alt={`slide-${index}`} />
              )}
            </div>
          ))}
        </div>

        <div className="carousel_pagination">
          {images.map((_, index) => (
            <div
              key={index}
              className={
                index === current
                  ? "pagination_dot pagination_dot-active"
                  : "pagination_dot"
              }
              onClick={() => setCurrent(index)}
            ></div>
          ))}
        </div>
        <div
          className="carousel_arrow_left text-4xl text-white cursor-pointer"
          onClick={slideLeft}
        >
          &lsaquo;
        </div>
        <div
          className="carousel_arrow_right text-4xl text-white cursor-pointer"
          onClick={slideRight}
        >
          &rsaquo;
        </div>
      </div>
    </div>
  );
}

export default Carousel;
