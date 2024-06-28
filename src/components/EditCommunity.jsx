import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const EditCommunityForm = ({ business_id, data }) => {
  const [allCommunities, setAllCommunities] = useState(data);
  const [activeCommunityId, setActiveCommunityId] = useState(null);
  const [error, setError] = useState(null);
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

  const [initialFormData, setInitialFormData] = useState({});
  const [CommunityImagePreview, setCommunityImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socialMediaIcons, setSocialMediaIcons] = useState([]);
  const [isCustomIcon, setIsCustomIcon] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [customIconPreview, setCustomIconPreview] = useState(null);
  const [customIconName, setCustomIconName] = useState("");
  const [errors, setErrors] = useState({});

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
    let formErrors = {};
    
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    
    if (!formData.community_name) formErrors.community_name = "Community name is required.";
    if (!formData.social_media_name) formErrors.social_media_name = "Social media name is required.";
    if (!formData.Social_icon) formErrors.Social_icon = "Social media icon is required.";
    
    if (formData.payment_type === "free") {
      if (!formData.free_link) {
        formErrors.free_link = "Free link is required.";
      } else if (!urlPattern.test(formData.free_link)) {
        formErrors.free_link = "Please enter a valid URL.";
      }
    }
    
    if (formData.payment_type === "paid") {
      if (!formData.paid_link) {
        formErrors.paid_link = "Paid link is required.";
      } else if (!urlPattern.test(formData.paid_link)) {
        formErrors.paid_link = "Please enter a valid URL.";
      }
      
      if (!formData.free_link) {
        formErrors.free_link = "Free link is required.";
      } else if (!urlPattern.test(formData.free_link)) {
        formErrors.free_link = "Please enter a valid URL.";
      }
    }
    
    if (!formData.community_description) formErrors.community_description = "Community description is required.";
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };


  const isFormModified = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormModified()) {
      alert("No changes made.");
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.patch(`https://digicholabackendfinal.onrender.com/api/v1/auth/createcommunity/${activeCommunityId}/`, formData,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }
      );
      alert("Community Updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error creating community:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunitySelect = (community) => {
    if (activeCommunityId === community.id) {
      setIsVisible(!isVisible); // Toggle form visibility if the same community is clicked
    } else {
      setActiveCommunityId(community.id);
      setFormData(community);
      setInitialFormData(community);
      setIsVisible(true); // Show form if a different community is selected
    }
  };
  const CommunityDelete = async ()=>{
    setLoading(true);
    try {
      await axios.delete(`https://digicholabackendfinal.onrender.com/api/v1/auth/createcommunity/${activeCommunityId}/`,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }
      );
      alert("Community Deleted");
      window.location.reload();
    } catch (error) {
      console.error("Error Deleting community:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {allCommunities ? (
        <div className='my-4'>
          <h1 className='text-[20px] font-bold'>Community Info</h1>
          <div className="flex flex-wrap my-2">
            {allCommunities.map((community) => (
              <button
                key={community.id}
                className="flex flex-col items-center justify-center gap-2 border border-blue-700 text-black font-bold py-2 px-4 rounded mr-4 mb-4"
                onClick={() => handleCommunitySelect(community)}
              >
                <img src={community.community_profile} alt="logo" className='h-[40px] w-[40px] rounded-sm object-cover'/>
                {community.community_name}
              </button>
            ))}
          </div>
          {isVisible && 
          <div className="w-full max-w-lg mx-auto p-4 rounded-lg shadow-lg border">
            <button className='text-[20px] float-right' onClick={() => setIsVisible(!isVisible)}>
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
                      <img src='/community.png'/>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCommunityImageChange}
                    className="hidden"
                    id="CommunityProfileUpdate"
                  />
                  <label
                    htmlFor="CommunityProfileUpdate"
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
                {errors.community_name && <p className="text-red-500 text-xs">{errors.community_name}</p>}
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
                {errors.social_media_name && <p className="text-red-500 text-xs">{errors.social_media_name}</p>}
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2 text-gray-700">Social Media Icon</label>
                <div className="flex flex-wrap gap-2">
                  {socialMediaIcons.map((icon) => (
                    <div
                      key={icon.id}
                      className={`flex items-center gap-2 cursor-pointer p-2 border ${formData.Social_icon === icon.social_media_icon ? 'border-blue-500' : 'border-gray-300'}`}
                      onClick={() => { handleSocialMediaSelection(icon.social_media_icon, icon.social_media_name); setIsCustomIcon(false); }}
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
                {errors.Social_icon && <p className="text-red-500 text-xs">{errors.Social_icon}</p>}
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
                      id="socialMediaCustomUpdate"
                    />
                    <label
                      htmlFor="socialMediaCustomUpdate"
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
                  {errors.free_link && <p className="text-red-500 text-xs">{errors.free_link}</p>}
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
                    {errors.paid_link && <p className="text-red-500 text-xs">{errors.paid_link}</p>}
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
                    {errors.free_link && <p className="text-red-500 text-xs">{errors.free_link}</p>}
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
                {errors.community_description && <p className="text-red-500 text-xs">{errors.community_description}</p>}
              </div>

              <button
                type="submit"
                className={`w-full p-2 bg-blue-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
              <button
                onClick={CommunityDelete}
                className={`w-full p-2 bg-red-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </form>
          </div>
          }
        </div>
      ) : (
        <div>
          <h1 className='text-[18px] text-gray-500 mb-4 text-center font-bold'>Community is not yet Created! Create new</h1>
        </div>
      )}
    </div>
  );
};

export default EditCommunityForm;
