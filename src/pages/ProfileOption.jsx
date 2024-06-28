import React, { useState } from "react";
import { CreditCard, Heart, Settings, ChevronLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import axios from "axios";

const ProfileOptions = () => {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const navigate = useNavigate();
  const is_business_user = localStorage.getItem("is_business_user");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const handleLogout = async () => {
    setIsSigningOut(true);
    const accessToken = JSON.parse(localStorage.getItem('token'));
    const refreshToken = JSON.parse(localStorage.getItem('refresh_token'));
    try {
      await axios.post(`${BACKEND_API_URL}/api/v1/auth/logout/`, {
        "refresh_token": refreshToken,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error('Failed to logout:', error);
      setIsSigningOut(false);
    }
  };

  const handleHomeNavigation = () => {
    navigate("/");
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleSubmit = async () => {
    if (!localStorage.getItem("phone_number")) {
      setError("Please add your phone number in user settings first.");
      return;
    }

    const userData = {
      user: parseInt(localStorage.getItem("userid")),
      full_name: fullName,
      phone_number: localStorage.getItem("phone_number"),
    };

    try {
      const response = await axios.post(
        `${BACKEND_API_URL}/api/v1/auth/business-users/`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
      );
      localStorage.setItem("is_business_user", true);

      console.log("Business user data posted successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Failed to post business user data:", error);
    }
  };

  const handlePaymentsClick = () => {
    setPaymentMessage("Payment service is not enabled/included. Contact Admin: +91 93802 02217 (call/whatsapp)");
    setTimeout(() => setPaymentMessage(""), 8000); // Clear message after 5 seconds
  };

  return (
    <div className="flex flex-col">
      <div className="fixed z-10 w-full top-0 bg-white">
        <div className="flex items-center justify-between py-2 sm:py-3">
          <button onClick={handleHomeNavigation} className="ml-[20px]">
            <ChevronLeft className="sm:w-[50px] sm:h-[30px]" />
          </button>
          <div className="card-business-name text-[20px] flex items-center gap-[8px]">Profile Settings
          </div>
          <button className="mr-[20px] p-[10px] shadow-lg rounded-lg">
            <FaUser className="text-[20px] font-bold" />
          </button>
        </div>
      </div>
      <section className="flex-grow flex-col justify-center mt-16">
      <div className="mx-auto mb-4 w-[200px] h-[40px] top-20">
        <section className="rounded-xl my-4 border-2 p-2 mx-4 sm:mx-5 lg:mx-10 bg-white flex items-center justify-center">
          <button
            className="text-lg font-bold text-blue-500 hover:text-blue-700 transform transition-transform hover:scale-105"
            onClick={handleLogout}
          >
            {isSigningOut ? 'Signing out...' : 'Sign Out'} <FaSignOutAlt className="inline" />
          </button>
        </section>
      </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-6">
            <Link to="/user/settings">
              <div className="mobile-setting-sizes flex flex-col items-center justify-center md:h-[160px] md:w-[160px] rounded-3xl shadow-lg border transform transition-transform hover:scale-105 bg-white text-violet-color hover:bg-indigo-500 hover:text-white">
                <h1 className="p-4 text-center font-bold text-md sm:text-lg md:xl">
                  User Settings
                </h1>
                <Settings className="text-4xl" />
              </div>
            </Link>
            <div className="flex flex-col items-center">
              <div className="mobile-setting-size2 bg-white flex flex-col items-center justify-center border my-2 mb-3 rounded-lg md:w-24 md:h-24 shadow-md transform transition-transform hover:scale-105 cursor-pointer" onClick={() => { navigate("/favourites") }}>
                <h1 className="text-xs font-medium sm:text-lg p-2 text-center md:text-xs">
                  Favorites
                </h1>
                <Heart className="text-gray-600 text-3xl" />
              </div>
              <div className="mobile-setting-size2 cursor-pointer bg-white border flex items-center justify-center flex-col rounded-lg md:w-24 md:h-24 shadow-md transform transition-transform hover:scale-105" onClick={handlePaymentsClick}>
                <h1 className="p-2 font-medium text-xs text-center">
                  Payments
                </h1>
                <CreditCard className="text-gray-600 text-3xl" />
              </div>
            </div>
          </div>
          {paymentMessage && (
            <div className="payment-message text-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-xs mx-auto">
              <span className="block sm:inline">{paymentMessage}</span>
            </div>
          )}
          {is_business_user === 'true' ? (
            <Link to="/business/settings">
              <div className="flex flex-col items-center justify-center md:h-44 md:w-44 mobile-setting-sizes rounded-3xl border shadow-lg transform transition-transform hover:scale-105 bg-white text-violet-color hover:bg-blue-500 hover:text-white">
                <h1 className="p-4 text-center font-bold text-lg">
                  Business Settings
                </h1>
                <Settings className="text-4xl" />
              </div>
            </Link>
          ) : (
            <section className=" rounded-lg shadow-sm border p-10">
              <div className="flex flex-col">
                <input
                  type="text"
                  value={fullName}
                  onChange={handleFullNameChange}
                  placeholder="Enter Full Name"
                  className="border p-2 rounded-md mb-2 w-11/12 max-w-md w-[100%] focus:outline-none"
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md w-[100%] max-w-md transform transition-transform hover:scale-105"
                >
                  Activate Business Account
                </button>
              </div>
            </section>
          )}
        </div>
      </section>

    </div>
  );
};

export default ProfileOptions;
