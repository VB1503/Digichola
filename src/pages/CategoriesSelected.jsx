import React, { useEffect, useState } from "react";
import { FaStar, FaUser } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/SearchBar";

const CategorySelected = () => {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const { categorySelected } = useParams();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoryDetail();
  }, [categorySelected]);

  const fetchCategoryDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/search/categories/${categorySelected}`
      );
      setSelectedCategory(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching category detail:", error);
      setError("Error fetching category detail");
      setIsLoading(false);
    }
  };

  const openProfile = (businessId) => {
    navigate(`/profile/search/${categorySelected}/${businessId}/`);
  };

  const SkeletonLoader = () => {
    return (
      <div className="skeleton-card">
        <div className="skeleton-profile"></div>
        <div className="skeleton-details">
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-buttons">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <center className="h-[40px] mt-6 z-[1000] bg-white w-[90%] mx-auto">
        <SearchBar />
      </center>

      <section className="cards-cont">
        {isLoading ? (
          <div className="w-full flex flex-col gap-8 justify-center">
            {[...Array(6)].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        ) : (
          <>
            {error && (
              <center className="flex items-center w-full h-[60vh] justify-center">
                <h1 className="font-bold text-[20px] text-gray-400">{error}</h1>
              </center>
            )}

            {!error && selectedCategory.length === 0 && (
              <center className="flex items-center w-full h-[60vh] justify-center">
                <h1 className="font-bold text-[20px] text-gray-400">No Data Found</h1>
              </center>
            )}

            {!error && selectedCategory.length > 0 && (
              <p className="text-gray-400 text-[16px] font-bold w-full md:text-center">
                {selectedCategory.length} {selectedCategory.length === 1 ? "match" : "matches"} found
              </p>
            )}

            {selectedCategory.map((data, index) => (
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
          </>
        )}
      </section>
    </div>
  );
};

export default CategorySelected;