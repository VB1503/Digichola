import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { FaSquarePhone } from 'react-icons/fa6';
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';

function TopBusinesses() {
  const [topBusinesses, setTopBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImages, setCurrentImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://digicholabackendfinal.onrender.com/api/v1/auth/update-suggestions/');
        const suggestions = response.data.Suggestions;

        const updatedBusinesses = await Promise.all(
          suggestions.map(async (business) => {
            const galleryResponse = await axios.get(
              `https://digicholabackendfinal.onrender.com/api/v1/auth/vas_view_profile/${business.business_id}`
            );
            return { ...business, galleryImages: galleryResponse.data.Galary };
          })
        );

        setTopBusinesses(updatedBusinesses);

        // Initialize currentImages state
        const initialImages = {};
        updatedBusinesses.forEach(business => {
          if (business.galleryImages && business.galleryImages.length > 0) {
            initialImages[business.business_id] = 0;
          }
        });
        setCurrentImages(initialImages);

      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImages(prevState => {
        const newState = { ...prevState };
        topBusinesses.forEach(business => {
          if (business.galleryImages && business.galleryImages.length > 0) {
            newState[business.business_id] = (newState[business.business_id] + 1) % business.galleryImages.length;
          }
        });
        return newState;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [topBusinesses]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-500" />
        ))}
        {halfStar && <FaStarHalfAlt key="half" className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
        ))}
      </>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="w-[280px] relative shadow-md rounded-lg border border-yellow-500 card-max-width animate-pulse">
              <div className="w-full h-[200px] bg-gray-300 rounded-t-lg"></div>
              <div className="absolute top-10 left-0 bg-gray-300 h-6 w-24 rounded"></div>
              <div className="relative p-4 bg-blue-400 rounded-b-lg">
                <div className="flex gap-2 items-center mt-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex items-center mt-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="mt-2 h-12 bg-gray-300 rounded"></div>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, starIndex) => (
                    <FaRegStar key={starIndex} className="text-gray-300" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topBusinesses.map((business) => {
            const currentImageIndex = currentImages[business.business_id];
            const currentImage = business.galleryImages?.length > 0
              ? business.galleryImages[currentImageIndex]?.galary_photo
              : null;

            return (
              <div key={business.business_id} className='relative shadow-md rounded-lg border border-yellow-500 card-max-width'>
                <div className='w-full h-[200px]'>
                  {currentImage && (
                    <div className="relative">
                      <img src={currentImage} alt="Gallery" className="w-full h-[200px] object-cover rounded-t-lg" />
                    </div>
                  )}
                </div>
                <div className='absolute top-10 left-0 hover-annimate shadow-lg' onClick={() => { navigate(`/profile/home/${business.category}/${business.business_id}`) }}>
                  <HiArrowTopRightOnSquare className='text-[20px] font-bold text-gray-600' />
                  <p>Explore</p>
                </div>
                <div className="relative p-4 bg-blue-400 rounded-b-lg">
                  <div className='flex gap-2 items-center mt-2'>
                    <img src={business.business_profile} alt="profile" className='w-10 h-10 rounded-xl object-cover ' />
                    <h2 className="inline text-xl text-white font-bold">{business.business_name}</h2>
                  </div>
                  <div className="flex items-center mt-2 text-black font-bold">
                    <FaSquarePhone className="mr-2 text-[20px]" />
                    <span>{business.business_phone_number}</span>
                  </div>
                  <p className="mt-2 text-gray-800 top-business-des">{business.description}</p>
                  <div className="flex items-center mt-2">
                    {renderStars(parseFloat(business.rating))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TopBusinesses;
