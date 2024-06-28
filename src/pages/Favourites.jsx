import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import { FaStar, FaUser, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Favourites = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userid = localStorage.getItem("userid");

  useEffect(() => {
    fetchCategoryDetail();
  }, []);

  const fetchCategoryDetail = async () => {
    try {
      const response = await axios.get(
        `https://digicholabackendfinal.onrender.com/api/v1/auth/favourites/${parseInt(userid)}`
      );
      setSelectedCategory(response.data);
    } catch (error) {
      console.error("Error fetching category detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFavourite = async (fav_id) => {
    try {
      const response = await axios.delete(
        `https://digicholabackendfinal.onrender.com/api/v1/auth/favourites/${parseInt(userid)}`,
        { data: { favorite_id: fav_id } }
      );
      if (response.status === 200) {
        alert("Deleted successfully");
        // Update the list of favourites
        fetchCategoryDetail();
      }
    } catch (error) {
      console.error("Error deleting favourite business:", error);
    }
  };

  const openProfile = (businessId, category) => {
    navigate(`/profile/favourites/${category}/${businessId}/`);
  };

  return (
    <div>
      <center className="h-[40px] mt-6 z-[1000] bg-white w-[90%] mx-auto">
        <SearchBar />
      </center>

      {loading ? (
        <section className="cards-cont">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="card p-4 bg-gray-200 animate-pulse">
              <div className="card-section-1">
                <div className="card-business-name bg-gray-300 h-6 w-3/4 mb-2"></div>
                <div className="card-business-ratings flex items-center">
                  <div className="bg-gray-300 h-5 w-10"></div>
                  <FaStar className="text-yellow-500 ml-1" />
                </div>
              </div>
              <div className="card-section-2 flex">
                <div className="card-business-profile bg-gray-300 h-16 w-16 rounded-full mr-4"></div>
                <div className="card-business-details flex-1">
                  <div className="card-business-description bg-gray-300 h-12 mb-2"></div>
                  <div className="card-business-contacts flex space-x-4">
                    <div className="call-btn bg-gray-300 h-8 w-24 rounded"></div>
                    <div className="open-btn bg-gray-300 h-8 w-24 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <>
          <section className="cards-cont">
            {selectedCategory.map((data, index) => (
              <div key={index} className="relative card p-4 bg-white shadow-lg rounded-lg mb-4 relative">
                <div className="card-section-1 flex justify-between items-center mb-2">
                  <div className="card-business-name">
                    <h1 className="text-lg font-bold">{data.business_name}</h1>
                  </div>

                  <div className="card-business-ratings flex items-center">
                    {data.rating} <FaStar className="text-yellow-500 ml-1" />
                  </div>
                </div>
                <div className="card-section-2 flex">
                  <div className="card-business-profile mr-4">
                    <img
                      src={data.business_profile}
                      alt="profile"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  </div>
                  <div className="card-business-details flex-1">
                    <div className="card-business-description mb-2">
                      <p className="truncate-2-lines">{data.description}</p>
                    </div>
                    <div className="card-business-contacts flex space-x-4">
                      <button
                        className="call-btn bg-blue-500 text-white px-4 py-2 rounded flex items-center"
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
                        onClick={() => openProfile(data.business, data.category)}
                        className="open-btn bg-green-500 text-white px-4 py-2 rounded flex items-center"
                      >
                        <FaUser className="mr-2" /> Open Profile
                      </button>
                    </div>
                  </div>
                </div>
                <div className="justify-end text-red-500 cursor-pointer flex items-center gap-1 text-[14px]" onClick={() => deleteFavourite(data.id)}>
                  <FaTrash />
                  <span>Delete</span>
                  </div>
              </div>
            ))}
          </section>
          {selectedCategory.length === 0 && (
            <center className="flex items-center w-full h-[60vh] justify-center">
              <h1 className="font-bold text-[20px] text-gray-400">
                Favourite List is not yet added
              </h1>
            </center>
          )}
        </>
      )}
    </div>
  );
};

export default Favourites;
