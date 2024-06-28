import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdBusiness } from 'react-icons/md';
import { ChevronLeft } from 'lucide-react';
import CreateCommunity from '../components/Createcommunity';
import ImageCarouselCard from '../components/ImageCarouselCard';
import axios from 'axios';
import CreateLinkChain from '../components/CreateLinkchain';
import QnAComponent from '../components/QandA';
import UpdatesOverview from '../components/UpdatesOverview';
import Certificate from '../components/DcCertificate';
import { decryptBusinessId } from '../utils/LockAndKey';
function EditBusiness() {
  const { business_id } = useParams();
  const decryptedId = decryptBusinessId(decodeURIComponent(business_id));
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState([1]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState({});
  const [errors, setErrors] = useState({});
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const dropdownRef = useRef(null);

  const [initialFormData, setInitialFormData] = useState({});
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (!decryptedId) {
      setError("Business is missing.");
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://digicholabackendfinal.onrender.com/search/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://digicholabackendfinal.onrender.com/api/v1/auth/vas_view_profile/${decryptedId}/`);
        setBusinessData(response.data);
        console.log(response.data);
        const Data = response.data.BusinessDetails[0];
        const initialData = {
          business_name: Data.business_name || '',
          business_email: Data.business_email || '',
          business_phone_number: Data.business_phone_number || '',
          whatsapp_phone_number: Data.whatsapp_phone_number || '',
          business_profile: Data.business_profile || '',
          Location: Data.Location || '',
          place: Data.place || '',
          description: Data.description || '',
          category: Data.category || '',
          business_user: parseInt(localStorage.getItem("userid")),
        };
        setInitialFormData(initialData);
        setFormData(initialData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchCategories();
    fetchData();
  }, [decryptedId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate('/business/settings');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.business_name) newErrors.business_name = 'Business name is required';
    if (!formData.business_email) newErrors.business_email = 'Business email is required';
    if (!formData.business_phone_number) newErrors.business_phone_number = 'Business phone number is required';
    if (!formData.whatsapp_phone_number) newErrors.whatsapp_phone_number = 'WhatsApp phone number is required';
    if (!formData.Location) newErrors.Location = 'Location is required';
    if (!formData.place) newErrors.place = 'Place is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (JSON.stringify(initialFormData) === JSON.stringify(formData)) {
      alert('No changes made.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(`https://digicholabackendfinal.onrender.com/api/v1/auth/business-details/${decryptedId}/`, formData,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }
      );
      alert('Business updated successfully:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating business:', error);
      setError('Error updating business');
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({ ...formData, Location: `${latitude},${longitude}` });
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
      const response = await axios.post("https://api.cloudinary.com/v1_1/dybwn1q6h/image/upload", data);
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePreview(URL.createObjectURL(file));
    setFormData({ ...formData, business_profile: file });
  };

  const handleImageUpload = async () => {
    try {
      const imageUrl = await uploadImage(formData.business_profile);
      setFormData({ ...formData, business_profile: imageUrl });
      setProfilePreview(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageUploadCarry = (cardName, files) => {
    setSelectedImages((prev) => ({ ...prev, [cardName]: files }));
  };

  if (loading) {
    return (
      <div className='mb-28'>
      <div className="fixed z-10 w-full top-0 bg-white">
        <div className="flex items-center justify-between py-4">
          <div className="ml-[20px] h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-48 bg-gray-300 rounded"></div>
          <div className="mr-[20px] h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <div className="w-[360px] p-6 rounded-xl border shadow-lg mx-auto mt-20 md:w-[80%] mx-auto">
          <div className="flex flex-col my-4">
            <div className="relative w-24 h-24 rounded-full shadow-lg overflow-hidden bg-gray-300"></div>
            <div className="mt-4 h-8 w-24 bg-gray-300 rounded"></div>
          </div>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col my-4">
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
              <div className="mt-2 h-10 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
          <div className="w-full p-2 bg-gray-300 text-white rounded mt-4"></div>
        </div>
      </div>
    </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
console.log(businessData.BusinessDetails[0].is_Qr_generated)
  return (
    <div className='mb-28'>
      <div className="fixed z-10 w-full top-0  bg-white">
      <div className="flex items-center justify-between py-4">
        <button onClick={handleBack} className="ml-[20px]">
          <ChevronLeft className="sm:w-[50px] sm:h-[30px]" />
        </button>
        <div className="card-business-name text-[20px] flex items-center gap-[8px]">
          Edit {formData.business_name}
        </div>
        <button className="mr-[20px] p-[10px] shadow-lg rounded-lg">
          <MdBusiness className="text-[20px] font-bold text-violet-700" />
        </button>
      </div>
    </div>
    <div className='flex flex-col items-center justify-center'>
    <div className="w-[360px] p-6 rounded-xl border shadow-lg mx-auto mt-20 md:w-[80%] mx-auto">
      <form onSubmit={handleBusinessSubmit}>
        <div className="flex flex-col my-4">
          <h1 className="text-[20px] font-bold">Business Info</h1>
          <div className="flex items-center">
            <div className="relative w-24 h-24 rounded-full shadow-lg overflow-hidden bg-gray-200">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="object-cover w-full h-full"
                />
              ) : formData.business_profile ? (
                <img
                  src={formData.business_profile}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <img src="/Contact.png" className="w-full h-full object-cover" />
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
            value={formData.business_name}
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
            value={formData.business_email}
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
            value={formData.business_phone_number}
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
            value={formData.whatsapp_phone_number}
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
            value={formData.Location}
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
            value={formData.place}
            onChange={handleChange}
            className={`outline-none my-1 sm:my-2 border-b ${errors.place ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.place && <p className="text-red-500 text-sm">{errors.place}</p>}
        </div>
        <div className="flex flex-col my-4">
          <label className="text-gray-500 text-[18px] sm:text-[22px]">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`outline-none my-1 sm:my-2 border-b ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>
        <div className="flex flex-col my-4">
          <label className="text-gray-500 text-[18px] sm:text-[22px]">Category</label>
          <div className="relative">
            <div className="relative w-full">
              {categories[0] && (
                <button
                  type="button"
                  className="w-full p-2 border border-gray-300 rounded outline-none text-left"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                >
                  {formData.category ? categories.find((c) => c.id === formData.category).category : 'Select Category'}
                </button>
              )}
              {categoryDropdownOpen && categories && (
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
                        setFormData({
                          ...formData,
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
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
    {businessData.BusinessDetails[0].is_approved &&
    <div>
      <div className='max-w-[500px] mx-auto w-[90%]'>
      <UpdatesOverview data={businessData.UpdatesOverview} business_id={decryptedId}/>
      </div>
      <div className='w-full'>
        <CreateCommunity business_id={decryptedId} data={businessData.CreateCommunity}/>
      </div>
      <div className='p-3 mx-auto rounded-lg shadow-xl border mt-4 w-[90%]'>
        <h1 className='text-[22px] text-gray-500 font-bold ml-2 mb-3'>Updates & Certificate</h1>
        <ImageCarouselCard
          carouselName="Gallery"
          imageFieldName="galary_photo"
          imageData={businessData.Galary || []}
          postImageUrlEndpoint="https://digicholabackendfinal.onrender.com/api/v1/auth/imageurls/"
          patchImageUrlEndpoint="https://digicholabackendfinal.onrender.com/api/v1/auth/imageurls"
          onUpload={handleImageUploadCarry}
          business_id={decryptedId}
        />
        <ImageCarouselCard
          carouselName="Business Updates"
          imageFieldName="poster"
          imageData={businessData.BusinessUpdatePosters || []}
          postImageUrlEndpoint="https://digicholabackendfinal.onrender.com/api/v1/auth/businessupdateposters/"
          patchImageUrlEndpoint="https://digicholabackendfinal.onrender.com/api/v1/auth/businessupdateposters"
          onUpload={handleImageUploadCarry}
          business_id={decryptedId}
        />
        <ImageCarouselCard
          carouselName="Banner Images"
          imageFieldName="banner_image"
          imageData={businessData.BannerImages || []}
          postImageUrlEndpoint="https://digicholabackendfinal.onrender.com/api/v1/auth/bannerimages/"
          patchImageUrlEndpoint="https://digicholabackendfinal.onrender.com/api/v1/auth/bannerimages"
          onUpload={handleImageUploadCarry}
          business_id={decryptedId}
        />
      </div>
      <div className=' w-[100%]'>
      <Certificate data={businessData.DcCertification} business_id={decryptedId}/>
      </div>
      <div className='mx-[10px] mt-4'>
      <CreateLinkChain data={businessData.LinkChain} business_id={decryptedId}/>
      </div>

      <div className='mb-10 w-full'>
      <QnAComponent data={businessData.CustomDescription} business_id={decryptedId}/>
      </div>
      </div>
}
      </div>
    </div>
  );
}

export default EditBusiness;
