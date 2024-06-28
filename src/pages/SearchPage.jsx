import React, { useEffect, useState } from "react";
import { FaStar, FaUser } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/SearchBar";

const SearchResult = () => {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const { categorySelected } = useParams();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryDetail();
  }, [categorySelected]);

  const fetchCategoryDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const latitude = localStorage.getItem('latitude');
      const longitude = localStorage.getItem('longitude');
      let apiUrl = `${BACKEND_API_URL}/search/search/?query=${categorySelected}`;
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

  const navigate = useNavigate();
  const openProfile = (businessId) => {
    navigate(`/profile/search/${categorySelected}/${businessId}/`);
  };

  return (
    <div>
      <center className="h-[40px] mt-6 z-[1000] bg-white w-[90%] mx-auto">
        <SearchBar />
      </center>



      <section className="cards-cont">
        {isLoading && (
          <center className="w-full h-[80vh] flex items-center justify-center">
            <span className="text-violet-700 font-bold text-[20px]">
              Loading<span className="text-yellow-600">...</span>
            </span>
          </center>
        )}

        {error && (
          <center className="flex items-center w-full h-[60vh] justify-center">
            <h1 className="font-bold text-[20px] text-gray-400">{error}</h1>
          </center>
        )}

        {!isLoading && !error && selectedCategory.length === 0 && (
          <center className="flex items-center w-full h-[60vh] justify-center">
            <h1 className="font-bold text-[20px] text-gray-400">No Data Found</h1>
          </center>
        )}
          
          {!isLoading && !error && selectedCategory.length > 0 && (
          <p className="text-gray-400 text-[14px] font-bold w-full ml-4">
            {selectedCategory.length} {selectedCategory.length === 1 ? "match" : "matches"} found
          </p>
        )}

        {!isLoading && !error && selectedCategory.length > 0 &&
          selectedCategory.map((data, index) => (
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
          ))}
      </section>
    </div>
  );
};

export default SearchResult;
