import React, { useState, useEffect, useRef } from 'react';
import { MdBusiness } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import axios from 'axios';
import { encryptBusinessId } from '../utils/LockAndKey';
function AddBusiness() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/business/settings');
  };
 
  const [businessFormData, setBusinessFormData] = useState({
    business_name: '',
    business_email: '',
    business_phone_number: '',
    whatsapp_phone_number: '',
    business_profile: '',
    Location: '',
    place: '',
    description: '',
    category: '',
    business_user: parseInt(localStorage.getItem("userid")),
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [newBusinessData, setNewBusinessData] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://digicholabackendfinal.onrender.com/search/categories/'
        );
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setBusinessFormData({
      ...businessFormData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!businessFormData.business_name) newErrors.business_name = 'Business name is required';
    if (!businessFormData.business_email) newErrors.business_email = 'Business email is required';
    if (!businessFormData.business_phone_number) newErrors.business_phone_number = 'Business phone number is required';
    if (!businessFormData.whatsapp_phone_number) newErrors.whatsapp_phone_number = 'WhatsApp phone number is required';
    if (!businessFormData.Location) newErrors.Location = 'Location is required';
    if (!businessFormData.place) newErrors.place = 'Place is required';
    if (!businessFormData.description) newErrors.description = 'Description is required';
    if (!businessFormData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        'https://digicholabackendfinal.onrender.com/api/v1/auth/business-details/',
        businessFormData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
      );
      console.log(response.data.Data.business_id);
      localStorage.setItem('new_business_id', parseInt(response.data.Data.business_id));
      setNewBusinessData(response.data.Data);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error adding business:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setBusinessFormData({ ...businessFormData, Location: `${latitude},${longitude}`});
        },
        (error) => {
          console.error('Error detecting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const uploadImage = async (image) => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "jvvslzla");
      data.append("cloud_name", "dybwn1q6h");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dybwn1q6h/image/upload",
        data
      );
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePreview(URL.createObjectURL(file));
    setBusinessFormData({ ...businessFormData, business_profile: file });
  };

  const handleImageUpload = async () => {
    try {
      const imageUrl = await uploadImage(businessFormData.business_profile);
      setBusinessFormData({ ...businessFormData, business_profile: imageUrl });
      setProfilePreview(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const GoToEdit = ()=>{
    const encryptedId = encryptBusinessId(localStorage.getItem('new_business_id'));
    navigate(`/edit_business/${encodeURIComponent(encryptedId)}`)
  }

  return (
    <div className='mb-28'>
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center relative w-[90%] bg-gif">
            {/* <img src="/congratulation.gif" alt="gif" className='absolute w-full h-full left-0 top-0' /> */}
            <button 
              onClick={() => navigate('/')} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-xl">
                <img
                  src={newBusinessData.business_profile}
                  alt="Business Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{newBusinessData.business_name}</h2>
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="mb-4">You have successfully created your business.</p>
            <p className='text-red-600'>To Get Full Access Wait For Digichola Approval</p>
            <button
              onClick={GoToEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Go to Edit Business
            </button>
          </div>
        </div>
      )}
      <div className="fixed z-10 w-full top-0 py-2 bg-white">
        <div className="flex items-center justify-between py-3 sm:py-5">
          <button onClick={handleBack} className="ml-[20px]">
            <ChevronLeft className="sm:w-[50px] sm:h-[30px]" />
          </button>
          <div className="card-business-name text-[20px] flex items-center gap-[8px]">
            Add Your Business
          </div>
          <button className="mr-[20px] p-[10px] shadow-lg rounded-lg">
            <MdBusiness className="text-[20px] font-bold text-violet-700" />
          </button>
        </div>
      </div>
      <section className=" mt-[100px] flex flex-col justify-center items-center md:w-[80%] mx-auto">
        <div className="w-[360px] p-6 rounded-xl border shadow-lg md:w-full ">
          <form onSubmit={handleBusinessSubmit}>
            <div className="flex flex-col my-4">
              <h1 className='text-[20px] font-bold'>Business Info</h1>
              <div className="flex items-center">
                <div className="relative w-24 h-24 rounded-full shadow-lg overflow-hidden bg-gray-200">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : businessFormData.business_profile ? (
                    <img
                      src={businessFormData.business_profile}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <img src='/Contact.png' className='w-full h-full object-cover' />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profilePicUpload"
                />
                <label
                  htmlFor="profilePicUpload"
                  className="ml-4 p-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                  Choose Image
                </label>
              </div>
              {profilePreview && (
                <div className="mt-4 flex items-center">
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="p-2 bg-green-500 text-white rounded"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfilePreview(null)}
                    className="ml-2 p-2 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col my-4">
              <label className="text-gray-500 text-[18px] sm:text-[22px]">Business Name</label>
              <input
                type="text"
                name="business_name"
                value={businessFormData.business_name}
                onChange={handleChange}
                className={`outline-none my-1 sm:my-2 border-b ${errors.business_name ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.business_name && <p className="text-red-500 text-sm">{errors.business_name}</p>}
            </div>
            <div className="flex flex-col my-4">
              <label className="text-gray-500 text-[18px] sm:text-[22px]">Business Email</label>
              <input
                type="email"
                name="business_email"
                value={businessFormData.business_email}
                onChange={handleChange}
                className={`outline-none my-1 sm:my-2 border-b ${errors.business_email ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.business_email && <p className="text-red-500 text-sm">{errors.business_email}</p>}
            </div>
            <div className="flex flex-col my-4">
              <label className="text-gray-500 text-[18px] sm:text-[22px]">Business Phone Number</label>
              <input
                type="text"
                name="business_phone_number"
                value={businessFormData.business_phone_number}
                onChange={handleChange}
                className={`outline-none my-1 sm:my-2 border-b ${errors.business_phone_number ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.business_phone_number && <p className="text-red-500 text-sm">{errors.business_phone_number}</p>}
            </div>
            <div className="flex flex-col my-4">
              <label className="text-gray-500 text-[18px] sm:text-[22px]">WhatsApp Phone Number</label>
              <input
                type="text"
                name="whatsapp_phone_number"
                value={businessFormData.whatsapp_phone_number}
                onChange={handleChange}
                className={`outline-none my-1 sm:my-2 border-b ${errors.whatsapp_phone_number ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.whatsapp_phone_number && <p className="text-red-500 text-sm">{errors.whatsapp_phone_number}</p>}
            </div>
            <div className="flex flex-col my-4 relative">
              <label className="text-gray-500 text-[18px] sm:text-[22px]">Location</label>
              <input
                type="text"
                name="Location"
                value={businessFormData.Location}
                onChange={handleChange}
                className={`outline-none my-1 sm:my-2 border-b ${errors.Location ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              <button
                type="button"
                className="absolute top-0 right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md"
                onClick={detectLocation}
              >
                Detect Location
              </button>
              {errors.Location && <p className="text-red-500 text-sm">{errors.Location}</p>}
            </div>
            <div className="flex flex-col my-4">
              <label className="text-gray-500 text-[18px] sm:text-[22px]">Place</label>
              <input
                type="text"
                name="place"
                value={businessFormData.place}
                onChange={handleChange}
                className={`outline-none my-1 sm:my-2 border-b ${errors.place ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.place && <p className="text-red-500 text-sm">{errors.place}</p>}
            </div>
            <div className="flex flex-col my-4">
              <label className="text-gray-500 text-[18px] sm:text-[22px]">Description</label>
              <textarea
                name="description"
                value={businessFormData.description}
                onChange={handleChange}
                className={`outline-none my-1 sm:my-2 border-b ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className="flex flex-col my-4">
              <label className="text-gray-500 text-[18px] sm:text-[22px]">Category</label>
              <div className="relative">
                <div className="relative w-full">
                  <button
                    type="button"
                    className="w-full p-2 border border-gray-300 rounded outline-none text-left"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  >
                    {businessFormData.category
                      ? categories.find((c) => c.id === businessFormData.category)?.category
                      : 'Select Category'}
                  </button>
                  {categoryDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-5 w-full bg-white border border-gray-300 rounded max-h-60 overflow-y-auto"
                      style={{ bottom: '100%', marginBottom: '5px' }}
                    >
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => {
                            setBusinessFormData({
                              ...businessFormData,
                              category: category.id,
                            });
                            setCategoryDropdownOpen(false);
                          }}
                        >
                          {category.category}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AddBusiness;
