import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaPlus } from 'react-icons/fa';
import EditCommunityForm from './EditCommunity';

const CreateCommunity = ({ business_id, data }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    community_name: "",
    social_media_name: "Whatsapp",
    Social_icon: "https://cdn-icons-png.flaticon.com/128/15707/15707820.png",
    paid_link: "",
    free_link: "",
    community_profile: "",
    community_description: "",
    payment_type: "free",
    businessId: business_id,
  });
  const [errors, setErrors] = useState({});
  const [CommunityImagePreview, setCommunityImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socialMediaIcons, setSocialMediaIcons] = useState([]);
  const [isCustomIcon, setIsCustomIcon] = useState(false);
  const [customIconPreview, setCustomIconPreview] = useState(null);
  const [customIconName, setCustomIconName] = useState("");

  useEffect(() => {
    const fetchSocialMediaIcons = async () => {
      try {
        const response = await axios.get("https://digicholabackendfinal.onrender.com/api/v1/auth/social-media-icons/");
        setSocialMediaIcons(response.data);
      } catch (error) {
        console.error("Error fetching social media icons:", error);
      }
    };

    fetchSocialMediaIcons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCommunityImageChange = (e) => {
    const file = e.target.files[0];
    setCommunityImagePreview(URL.createObjectURL(file));
    setFormData({ ...formData, community_profile: file });
  };

  const handleCommunityImageUpload = async () => {
    setLoading(true);
    try {
      const imageUrl = await uploadImage(formData.community_profile);
      setFormData({ ...formData, community_profile: imageUrl });
      setCommunityImagePreview(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomIconChange = (e) => {
    const file = e.target.files[0];
    setCustomIconPreview(URL.createObjectURL(file));
    setFormData({ ...formData, custom_social_icon: file });
  };

  const handleCustomIconSubmit = async (e) => {
    e.preventDefault();
    const { custom_social_icon } = formData;
    setLoading(true);
    try {
      const iconUrl = await uploadImage(custom_social_icon);
      const response = await axios.post("https://digicholabackendfinal.onrender.com/api/v1/auth/social-media-icons/", {
        social_media_name: customIconName,
        social_media_icon: iconUrl,
      });
      setSocialMediaIcons([...socialMediaIcons, response.data]);
      setFormData({ ...formData, Social_icon: iconUrl, social_media_name: customIconName });
      setIsCustomIcon(false);
      setCustomIconPreview(null);
      setCustomIconName("");
    } catch (error) {
      console.error("Error uploading custom icon:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMediaSelection = (icon, name) => {
    setFormData({ ...formData, Social_icon: icon, social_media_name: name });
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.community_name.trim()) newErrors.community_name = "Community name is required.";
    if (!formData.community_description.trim()) newErrors.community_description = "Community description is required.";
    if (!formData.community_profile) newErrors.community_profile = "Community profile image is required.";

    if (formData.payment_type === "free") {
      if (!formData.free_link.trim()) newErrors.free_link = "Free link is required.";
      if (formData.free_link && !isValidURL(formData.free_link)) newErrors.free_link = "Free link must be a valid URL.";
    }

    if (formData.payment_type === "paid") {
      if (!formData.paid_link.trim()) newErrors.paid_link = "Paid link is required.";
      if (formData.paid_link && !isValidURL(formData.paid_link)) newErrors.paid_link = "Paid link must be a valid URL.";
      if (!formData.free_link.trim()) newErrors.free_link = "Free link is required.";
      if (formData.free_link && !isValidURL(formData.free_link)) newErrors.free_link = "Free link must be a valid URL.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidURL = (string) => {
    const res = string.match(/(https?:\/\/[^\s]+)/g);
    return res !== null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.post("https://digicholabackendfinal.onrender.com/api/v1/auth/createcommunity/", formData,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }
      );
      alert("Community created successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error creating community:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container w-full p-4">
      <EditCommunityForm business_id={business_id} data={data} />
      {!formVisible ? (
        <button
          onClick={() => setFormVisible(true)}
          className="flex gap-2 items-center text-[20px] px-4 py-2 text-violet-color rounded-3xl border border-yellow-600"
        >
          <FaPlus /> Create a New Community
        </button>
      ) : (
        <div className="w-full max-w-lg mx-auto shadow-xl mt-6 rounded-lg border p-6 mb-6">
          <button className='text-[20px] float-right' onClick={() => setFormVisible(false)}>
            <FaTimes />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col my-4">
              <div className="flex items-center">
                <div className="relative w-24 h-24 rounded-lg shadow-xl overflow-hidden bg-gray-200">
                  {CommunityImagePreview ? (
                    <img
                      src={CommunityImagePreview || '/community.png'}
                      alt="Profile Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : formData.community_profile ? (
                    <img
                      src={formData.community_profile}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <img src='/community.png' />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCommunityImageChange}
                  className="hidden"
                  id="CommunityProfileUpload"
                />
                <label
                  htmlFor="CommunityProfileUpload"
                  className="ml-4 p-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                  Choose Image
                </label>
              </div>
              {CommunityImagePreview && (
                <div className="mt-4 flex items-center">
                  <button
                    type="button"
                    onClick={handleCommunityImageUpload}
                    className="p-2 bg-green-500 text-white rounded"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommunityImagePreview(null)}
                    className="ml-2 p-2 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {errors.community_profile && <p className="text-red-500">{errors.community_profile}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Community Name</label>
              <input
                type="text"
                name="community_name"
                value={formData.community_name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              />
              {errors.community_name && <p className="text-red-500">{errors.community_name}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Social Media Name</label>
              <input
                type="text"
                name="social_media_name"
                value={formData.social_media_name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              />
              {errors.social_media_name && <p className="text-red-500">{errors.social_media_name}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Social Media Icon</label>
              <div className="flex flex-wrap gap-2">
                {socialMediaIcons.map((icon) => (
                  <div
                    key={icon.id}
                    className={`flex items-center gap-2 cursor-pointer p-2 border ${formData.Social_icon === icon.social_media_icon ? 'border-blue-500' : 'border-gray-300'}`}
                    onClick={() => handleSocialMediaSelection(icon.social_media_icon, icon.social_media_name)}
                  >
                    <img src={icon.social_media_icon} alt={icon.social_media_name} className="w-8 h-8" />
                    <span>{icon.social_media_name}</span>
                  </div>
                ))}
                <div
                  className="flex items-center gap-2 cursor-pointer p-2 border border-gray-300"
                  onClick={() => setIsCustomIcon(!isCustomIcon)}
                >
                  <span>Others</span>
                </div>
              </div>
            </div>

            {isCustomIcon && (
              <div className="flex flex-col mb-4">
                <label className="mb-2 text-gray-700">Custom Social Media Name</label>
                <input
                  type="text"
                  name="custom_social_media_name"
                  value={customIconName}
                  onChange={(e) => setCustomIconName(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
                <label className="mb-2 text-gray-700">Custom Social Media Icon</label>
                <div className="flex items-center">
                  <div className="relative w-[40px] h-[40px]">
                    {customIconPreview ? (
                      <img
                        src={customIconPreview || '/community.png'}
                        alt="social media"
                        className="object-cover w-full h-full"
                      />
                    ) : formData.Social_icon ? (
                      <img
                        src={formData.Social_icon}
                        alt="social media"
                        className="object-cover w-full h-full"
                      />
                    ) : null}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomIconChange}
                    className="hidden"
                    id="socialMediaCusitom"
                  />
                  <label
                    htmlFor="socialMediaCusitom"
                    className="ml-4 p-2 bg-blue-500 text-white rounded cursor-pointer"
                  >
                    Choose Image
                  </label>
                </div>
                {customIconPreview && (
                  <div className="mt-4 flex items-center">
                    <button
                      type="button"
                      onClick={handleCustomIconSubmit}
                      className="p-2 bg-green-500 text-white rounded"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomIconPreview(null)}
                      className="ml-2 p-2 bg-red-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Payment Type</label>
              <div className="flex gap-4">
                <div
                  className={`cursor-pointer p-2 border ${formData.payment_type === 'free' ? 'border-blue-500' : 'border-gray-300'}`}
                  onClick={() => setFormData({ ...formData, payment_type: 'free' })}
                >
                  Free
                </div>
                <div
                  className={`cursor-pointer p-2 border ${formData.payment_type === 'paid' ? 'border-blue-500' : 'border-gray-300'}`}
                  onClick={() => setFormData({ ...formData, payment_type: 'paid' })}
                >
                  Paid
                </div>
              </div>
            </div>

            {formData.payment_type === "free" && (
              <div className="flex flex-col mb-4">
                <label className="mb-2 text-gray-700">Free Link</label>
                <input
                  type="text"
                  name="free_link"
                  value={formData.free_link}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                />
                {errors.free_link && <p className="text-red-500">{errors.free_link}</p>}
              </div>
            )}

            {formData.payment_type === "paid" && (
              <>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 text-gray-700">Paid Link</label>
                  <input
                    type="text"
                    name="paid_link"
                    value={formData.paid_link}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded"
                  />
                  {errors.paid_link && <p className="text-red-500">{errors.paid_link}</p>}
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 text-gray-700">Free Link</label>
                  <input
                    type="text"
                    name="free_link"
                    value={formData.free_link}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded"
                  />
                  {errors.free_link && <p className="text-red-500">{errors.free_link}</p>}
                </div>
              </>
            )}

            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Community Description</label>
              <textarea
                name="community_description"
                value={formData.community_description}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              />
              {errors.community_description && <p className="text-red-500">{errors.community_description}</p>}
            </div>

            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating Community...' : 'Create'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateCommunity;
