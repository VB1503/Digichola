import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Link, useLocation } from "react-router-dom";
import SearchBar from './SearchBar';

function Header() {
  const [location, setLocation] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State variable to track login status
  const [isLoading, setIsLoading] = useState(true); // State to track loading status of profile picture
  const plocation = useLocation();

  useEffect(() => {
    askLocationPermission();
    checkLoginStatus(); // Check login status when component mounts
  }, []);

  const askLocationPermission = () => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        if (permissionStatus.state === 'granted') {
          getLocation();
        }
      });
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
            );
            const data = await response.json();
            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);
            const shortenedLocation = shortenLocationName(data.display_name);
            setLocation(shortenedLocation);
          } catch (error) {
            console.error('Error fetching location:', error);
            setLocation('Error fetching location');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation('Location permission denied');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocation('Geolocation is not supported');
    }
  };

  const shortenLocationName = (locationName) => {
    // Shorten the location name if it's too long
    const maxLength = 12;
    if (locationName.length > maxLength) {
      return locationName.split(',')[0];
    }
    return locationName;
  };

  const handleDetectLocationClick = () => {
    getLocation();
  };

  // Function to check login status
  const checkLoginStatus = () => {
    const firstName = localStorage.getItem('first_name');
    if (firstName) {
      setIsLoggedIn(true);
      // Assuming profile picture is also stored in localStorage
      const profilePicUrl = localStorage.getItem('profile_pic');
      if (profilePicUrl) {
        const img = new Image();
        img.src = profilePicUrl;
        img.onload = () => {
          setProfilePic(profilePicUrl);
          setIsLoading(false);
        };
        img.onerror = () => {
          setProfilePic('/default-profile.png'); // Default profile picture path
          setIsLoading(false);
        };
      } else {
        setProfilePic('/default-profile.png'); // Default profile picture path
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='header-cont'>
      <div className='location-section'>
        <div className='location-icon'>
          <FaMapMarkerAlt />
        </div>
        <div className='detect-location-cont'>
          {location ? (
            <span>{location}</span>
          ) : (
            <button onClick={handleDetectLocationClick}>Detect Location</button>
          )}
        </div>
      </div>
      <div className='md:w-[86%] md:max-w-[1000px] mob-search-box md:mx-2'>
        <SearchBar />
      </div>
      <div className='profile-img-cont'>
        {/* Display login/signup button if user is not logged in */}
        {!isLoggedIn && plocation.pathname !== "/login" && (
          <Link to="/login" className="text-black flex items-center">
            <button className="text-[12px]">Login/Signup</button>
          </Link>
        )}
        {/* Display profile picture if user is logged in */}
        {isLoggedIn && (
          <Link to="/show_options">
            <div className="w-[34px] h-[34px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              ) : (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
