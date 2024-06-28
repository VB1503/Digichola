import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaExclamationCircle, FaTrash } from 'react-icons/fa';
import { MdBusiness } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { encryptBusinessId } from '../utils/LockAndKey';
import axios from 'axios';

function BusinessSettings() {
  const [businessDetails, setBusinessDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  const handleBack = () => {
    navigate('/show_options');
  };

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      const businessUserId = parseInt(localStorage.getItem('userid'), 10);
      try {
        const response = await axios.get(`https://digicholabackendfinal.onrender.com/api/v1/auth/business-user-details/${businessUserId}/`);
        setBusinessDetails(response.data);
      } catch (error) {
        console.error('Error fetching business details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, []);

  const handleAddBusiness = () => {
    navigate('/add_business');
  };

  const handleEditBusiness = (businessId) => {
    const encryptedId = encryptBusinessId(businessId);
    navigate(`/edit_business/${encodeURIComponent(encryptedId)}`);
  };

  const handleDeleteBusiness = async () => {
    try {
      await axios.delete(`https://digicholabackendfinal.onrender.com/api/v1/auth/business-details/${selectedBusinessId}/`);
      // Refresh business details after deletion
      window.location.reload();
    } catch (error) {
      console.error('Error deleting business:', error);
    } finally {
      setShowDeleteModal(null); // Close the confirmation popup
    }
  };

  return (
    <div className='mb-20'>
      <div className="fixed z-10 w-full top-0 bg-white">
        <div className="flex items-center justify-between py-4">
          <button onClick={handleBack} className='ml-2 md:ml-0'>
            <ChevronLeft className="sm:w-[50px] sm:h-[30px]" />
          </button>
          <div className="card-business-name text-[20px] flex items-center gap-[8px]">
            Business Settings
          </div>
          <button className="mr-[20px] p-[10px] shadow-lg rounded-lg">
            <MdBusiness className="text-[20px] font-bold text-violet-700" />
          </button>
        </div>
      </div>
      <div className="mt-[80px] p-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-lg bg-white animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : businessDetails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className='flex gap-3 items-center justify-center cursor-pointer' onClick={handleAddBusiness}>
              <FaPlus className='text-gray-500 text-[20px]' />
              <h1 className='text-gray-500 text-[20px]'>Add New Business</h1>
            </div>
            {businessDetails.map((business) => (
              <div key={business.business_id} className="relative border rounded-lg p-4 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <div className='absolute top-2 right-2 '>
                  <button
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleEditBusiness(business.business_id)}
                  >
                    <FaEdit className="text-[22px]" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 ml-2"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setSelectedBusinessId(business.business_id);
                    }}
                  >
                    <FaTrash className="text-[20px]" />
                  </button>
                </div>
                <div className="flex items-center mb-4">
                  <img
                    src={business.business_profile}
                    alt={business.business_name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{business.business_name}</h3>
                    <p className="text-sm text-gray-500">{business.business_email}</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {business.business_phone_number}
                </p>
                <p className="text-gray-700">
                  <strong>WhatsApp:</strong> {business.whatsapp_phone_number}
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong> {business.Location}
                </p>
                <p className="text-gray-700">
                  <strong>Place:</strong> {business.place}
                </p>
                <p className="text-gray-700">
                  <strong>Rating:</strong> {business.rating}
                </p>
                <p className="text-gray-700 mt-2">{business.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full flex flex-col items-center justify-center gap-3'>
          <div className='flex items-center justify-center gap-1 cursor-pointer' onClick={handleAddBusiness}>
            <FaPlus className='text-[20px] text-gray-400 '/>
            <h1 className='text-gray-400 text-[20px] '>Add your Business</h1>
          </div>
          <div className='flex flex-col gap-3 items-center md:flex-row md:flex-wrap justify-center'>
            <div className='w-[340px] flex flex-col gap-4 p-3 border rounded-lg shadow-lg bg-white'>
              <div className='flex gap-3 items-center'>
                <img src="https://cdn-icons-png.flaticon.com/128/4256/4256900.png" alt="Grow Business" className='rounded-lg h-[80px] p-4 shadow-sm border' />
                <h1 className='text-black font-bold text-[16px]'>
                  Start Growing your Business with <span className='text-blue-600 flex items-center gap-1'><img src="/favicon.ico" alt="logo" className='h-[20px]' />DigiChola</span>
                </h1>
              </div>
              <div>
                <p className='text-justify text-gray-500'>
                  Are you ready to take your business to the next level? Discover the power of DigiChola, your ultimate partner in business growth and success.
                </p>
              </div>
            </div>
    
            <div className='w-[340px] flex flex-col gap-4 p-3 border rounded-lg shadow-lg bg-white'>
              <div className='flex gap-3 items-center'>
                <img src="https://cdn-icons-png.flaticon.com/128/1239/1239608.png" alt="Reach Customers" className='rounded-lg h-[80px] p-4 shadow-sm border' />
                <h1 className='text-black font-bold text-[16px]'>
                  Reach More Customers
                </h1>
              </div>
              <div>
                <p className='text-justify text-gray-500'>
                  Expand your customer base by showcasing your business on DigiChola. Get discovered by potential customers looking for services you offer.
                </p>
              </div>
            </div>
    
            <div className='w-[340px] flex flex-col gap-4 p-3 border rounded-lg shadow-lg bg-white'>
              <div className='flex gap-3 items-center'>
                <img src="https://cdn-icons-png.flaticon.com/128/2888/2888393.png" alt="Boost Sales" className='rounded-lg h-[80px] p-4 shadow-sm border' />
                <h1 className='text-black font-bold text-[16px]'>
                  Boost Your Sales
                </h1>
              </div>
              <div>
                <p className='text-justify text-gray-500'>
                  Utilize DigiChola’s tools and features to boost your sales. From customer reviews to special promotions, leverage everything to grow your business.
                </p>
              </div>
            </div>
    
            <div className='w-[340px] flex flex-col gap-4 p-3 border rounded-lg shadow-lg bg-white'>
              <div className='flex gap-3 items-center'>
                <img src="https://cdn-icons-png.flaticon.com/128/7890/7890493.png" alt="Manage Online Presence" className='rounded-lg h-[80px] p-4 shadow-sm border' />
                <h1 className='text-black font-bold text-[16px]'>
                  Manage Your Online Presence
                </h1>
              </div>
              <div>
                <p className='text-justify text-gray-500'>
                  Keep your business information up-to-date and respond to customer reviews. DigiChola helps you maintain a positive online presence.
                </p>
              </div>
            </div>
    
            <div className='w-[340px] flex flex-col gap-4 p-3 border rounded-lg shadow-lg bg-white'>
              <div className='flex gap-3 items-center'>
                <img src="https://cdn-icons-png.flaticon.com/128/15708/15708419.png" alt="Get Insights" className='rounded-lg h-[80px] p-4 shadow-sm border' />
                <h1 className='text-black font-bold text-[16px]'>
                  Get Valuable Insights
                </h1>
              </div>
              <div>
                <p className='text-justify text-gray-500'>
                Be a part of our growing community of businesses. Network with other business owners, share insights, and learn from the best in the industry.
                </p>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
      {showDeleteModal && (
        <div className="modal-background">
          <div className="modal">
            <FaExclamationCircle className='fa-exclamation' />
            <h2 className='username'>Are you sure you want to delete your Business ?</h2>
            <p className='del-msg'>This action cannot be undone. Deleting your Business will permanently remove all information related to this business, including user reviews and any associated content.</p>
            <div className="button-group">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={handleDeleteBusiness}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessSettings;
