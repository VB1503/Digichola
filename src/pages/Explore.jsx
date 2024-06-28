import React, { useEffect, useState } from "react";
import { FaStar, FaUser, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Recents from "../components/Recents";
const SearchResult = () => {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState("searches");
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (searchValue) {
      fetchCategoryDetail();
      setIsNavbarVisible(true);
      setActiveMenu("searches");
    } else {
      setSelectedCategory([]);
      setIsNavbarVisible(false);
    }
  }, [searchValue]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/v1/auth/update-suggestions/`);
      setSuggestions(response.data.Suggestions);
    } catch (error) {
      setError("Error fetching suggestions.");
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const latitude = localStorage.getItem("latitude");
      const longitude = localStorage.getItem("longitude");
      let apiUrl = `${BACKEND_API_URL}/search/search/?query=${searchValue}`;
      if (latitude && longitude) {
        apiUrl += `&user_location=${latitude},${longitude}`;
      }
      const response = await axios.get(apiUrl);
      setSelectedCategory(response.data);
    } catch (error) {
      setError("Error fetching category detail.");
      console.error("Error fetching category detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchIconClick = () => {
    fetchCategoryDetail();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchCategoryDetail();
    }
  };

  const onInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const openProfile = (businessId) => {
    navigate(`/profile/Explore/Business/${businessId}/`);
  };

  const renderSearchCard = (data, index) => (
    <div key={index} className="card">
      <div className="card-section-1">
        <div className="card-business-name">
          <h1>{data.business_name}</h1>
        </div>
        <div className="card-business-ratings">
          {data.rating} <FaStar className="text-yellow-500" />
        </div>
      </div>
      <div className="card-section-2">
        <div className="card-business-profile">
          <img src={data.business_profile} alt="profile" />
        </div>
        <div className="card-business-details">
          <div className="card-business-description">
            <p className="truncate-2-lines">{data.description}</p>
          </div>
          <div className="card-business-contacts">
            <button
              className="call-btn"
              onClick={() => window.open(`tel:${data.business_phone_number}`)}
            >
              <img
                className="w-[18px] h-[18px] bg-white rounded-full"
                src="https://cdn-icons-png.flaticon.com/128/5585/5585856.png"
                alt="call"
              />{" "}
              Call now
            </button>
            <button
              onClick={() => openProfile(data.business_id)}
              className="open-btn"
            >
              <FaUser className="text-green-500" /> Open Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuggestionCard = (data, index) => (
    <div key={index} className="card">
      <div className="card-section-1">
        <div className="card-business-name">
          <h1>{data.business_name}</h1>
        </div>
        <div className="card-business-ratings">
          {data.rating} <FaStar className="text-yellow-500" />
        </div>
      </div>
      <div className="card-section-2">
        <div className="card-business-profile">
          <img src={data.business_profile} alt="profile" />
        </div>
        <div className="card-business-details">
          <div className="card-business-description">
            <p className="truncate-2-lines">{data.description}</p>
          </div>
          <div className="card-business-contacts">
            <button
              className="call-btn"
              onClick={() => window.open(`tel:${data.business_phone_number}`)}
            >
              <img
                className="w-[18px] h-[18px] bg-white rounded-full"
                src="https://cdn-icons-png.flaticon.com/128/5585/5585856.png"
                alt="call"
              />{" "}
              Call now
            </button>
            <button
              onClick={() => openProfile(data.business_id)}
              className="open-btn"
            >
              <FaUser className="text-green-500" /> Open Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <center className="h-[40px] mt-6 z-[1000] bg-white">
        <div className="search-bar shadow-lg relative w-[86%]">
          <input
            type="text"
            value={searchValue}
            onChange={onInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Doctor, Restaurants, Fitness"
            className="w-full rounded-lg py-[8px] pr-[10px] pl-[14px] border focus:outline-none focus:border-blue-500 search-in"
          />
          <div
            className="absolute right-2 top-[9px] text-gray-400 text-[12px] p-[6px] rounded-md cursor-pointer"
            style={{ backgroundColor: '#554CBC' }}
            onClick={handleSearchIconClick}
          >
            <FaSearch className="text-white" />
          </div>
        </div>
      </center>

      {isNavbarVisible && (
        <nav className="w-full bg-white shadow-md mt-4">
          <ul className="flex justify-center">
            <li
              className={`p-4 cursor-pointer ${activeMenu === "searches" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"}`}
              onClick={() => setActiveMenu("searches")}
            >
              Searches
            </li>
            <li
              className={`p-4 cursor-pointer ${activeMenu === "top10" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"}`}
              onClick={() => setActiveMenu("top10")}
            >
              Top 10 Searches
            </li>
            <li
              className={`p-4 cursor-pointer ${activeMenu === "recent" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"}`}
              onClick={() => setActiveMenu("recent")}
            >
              Recent's
            </li>
          </ul>
        </nav>
      )}

      <section className="cards-cont mt-4 mb-16">
        {isLoading && (
           <div className="p-4">
           <div className="animate-pulse flex space-x-4 mb-4">
             <div className="rounded-full bg-gray-300 h-12 w-12"></div>
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-gray-300 rounded w-3/4"></div>
               <div className="h-4 bg-gray-300 rounded"></div>
             </div>
           </div>
           <div className="animate-pulse flex space-x-4 mb-4">
             <div className="rounded-full bg-gray-300 h-12 w-12"></div>
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-gray-300 rounded w-3/4"></div>
               <div className="h-4 bg-gray-300 rounded"></div>
             </div>
           </div>
           <div className="animate-pulse flex space-x-4 mb-4">
             <div className="rounded-full bg-gray-300 h-12 w-12"></div>
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-gray-300 rounded w-3/4"></div>
               <div className="h-4 bg-gray-300 rounded"></div>
             </div>
           </div>
           <div className="animate-pulse flex space-x-4 mb-4">
             <div className="rounded-full bg-gray-300 h-12 w-12"></div>
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-gray-300 rounded w-3/4"></div>
               <div className="h-4 bg-gray-300 rounded"></div>
             </div>
           </div>
           <div className="animate-pulse flex space-x-4 mb-4">
             <div className="rounded-full bg-gray-300 h-12 w-12"></div>
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-gray-300 rounded w-3/4"></div>
               <div className="h-4 bg-gray-300 rounded"></div>
             </div>
           </div>
           <div className="animate-pulse flex space-x-4 mb-4">
             <div className="rounded-full bg-gray-300 h-12 w-12"></div>
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-gray-300 rounded w-3/4"></div>
               <div className="h-4 bg-gray-300 rounded"></div>
             </div>
           </div>
           <div className="animate-pulse flex space-x-4 mb-4">
             <div className="rounded-full bg-gray-300 h-12 w-12"></div>
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-gray-300 rounded w-3/4"></div>
               <div className="h-4 bg-gray-300 rounded"></div>
             </div>
           </div>
           <div className="animate-pulse flex space-x-4 mb-4">
             <div className="rounded-full bg-gray-300 h-12 w-12"></div>
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-gray-300 rounded w-3/4"></div>
               <div className="h-4 bg-gray-300 rounded"></div>
             </div>
           </div>
         </div>
        )}

        {error && (
          <center className="flex items-center w-full h-[60vh] justify-center">
            <h1 className="font-bold text-[20px] text-gray-400">{error}</h1>
          </center>
        )}

        {!isLoading && !error && activeMenu === "searches" && searchValue && selectedCategory.length === 0 && (
          <center className="flex items-center w-full h-[60vh] justify-center">
            <h1 className="font-bold text-[20px] text-gray-400">No Data Found</h1>
          </center>
        )}

        {!isLoading && !error && activeMenu === "searches" && searchValue && selectedCategory.length > 0 && (
          <p className="text-gray-400 text-[14px] font-bold w-full ml-4">
            {selectedCategory.length} {selectedCategory.length === 1 ? "match" : "matches"} found
          </p>
        )}

        {!isLoading && !error && activeMenu === "searches" && searchValue && selectedCategory.length > 0 &&
          selectedCategory.map((data, index) => renderSearchCard(data, index))
        }

        {!isLoading && !error && !searchValue && (
          <>
            <h1 className="text-gray-400 text-[16px] font-bold w-full ml-4">Top 10 Searches</h1>
            {suggestions.map((data, index) => renderSuggestionCard(data, index))}
          </>
        )}

        {!isLoading && !error && activeMenu === "top10" && searchValue && suggestions.length > 0 &&
          suggestions.map((data, index) => renderSuggestionCard(data, index))
        }
        {!isLoading && !error && activeMenu === "recent" && searchValue &&
          <Recents />
        }
      </section>
    </div>
  );
};

export default SearchResult;
