import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const LinkChain = ({ data, business_id }) => {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const [links, setLinks] = useState(data);
  const [activeLinkId, setActiveLinkId] = useState(null);
  const [formData, setFormData] = useState({
    link_icon: '',
    links: '',
    link_name: '',
    businessId: business_id,
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [socialMediaIcons, setSocialMediaIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCustomIcon, setIsCustomIcon] = useState(false);
  const [customIconPreview, setCustomIconPreview] = useState(null);
  const [customIconName, setCustomIconName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSocialMediaIcons = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/api/v1/auth/linkchain-media-icons/`);
        setSocialMediaIcons(response.data);
      } catch (error) {
        console.error('Error fetching social media icons:', error);
      }
    };

    fetchSocialMediaIcons();
  }, []);

  useEffect(() => {
    if (activeLinkId) {
      const linkToEdit = links.find((link) => link.id === activeLinkId);
      if (linkToEdit) {
        setFormData(linkToEdit);
        setInitialFormData(linkToEdit);
      }
    } else {
      setFormData({
        link_icon: '',
        links: '',
        link_name: '',
        businessId: business_id,
      });
      setInitialFormData(null);
    }
  }, [activeLinkId, links, business_id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.link_icon) newErrors.link_icon = 'Link icon is required.';
    if (!formData.links) {
      newErrors.links = 'Link is required.';
    } else {
      const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      if (!urlPattern.test(formData.links)) {
        newErrors.links = 'Please enter a valid URL.';
      }
    }
    if (!formData.link_name) newErrors.link_name = 'Link name is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCustomIconChange = (e) => {
    const file = e.target.files[0];
    setCustomIconPreview(URL.createObjectURL(file));
    setFormData({ ...formData, link_icon: file });
  };

  const handleCustomIconSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const iconUrl = await uploadImage(formData.link_icon);
      const response = await axios.post(`${BACKEND_API_URL}/api/v1/auth/linkchain-media-icons/`, {
        media_provider_name: customIconName,
        media_provider_icon: iconUrl,
      });
      setSocialMediaIcons([...socialMediaIcons, response.data]);
      setFormData({ ...formData, link_icon: iconUrl });
      setIsCustomIcon(false);
      setCustomIconPreview(null);
      setCustomIconName('');
    } catch (error) {
      console.error('Error uploading custom icon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMediaSelection = (icon, name) => {
    setFormData({ ...formData, link_icon: icon, link_name: name });
  };

  const uploadImage = async (image) => {
    try {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'jvvslzla');
      data.append('cloud_name', 'dybwn1q6h');
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dybwn1q6h/image/upload',
        data
      );
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      alert('No changes made.');
      return;
    }
    setLoading(true);
    try {
      if (activeLinkId) {
        await axios.patch(`${BACKEND_API_URL}/api/v1/auth/linkchain/${activeLinkId}/`, formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
        );
      } else {
        await axios.post(`${BACKEND_API_URL}/api/v1/auth/linkchain/`, formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
        );
      }
      alert('Link chain updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating link chain:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSelect = (link) => {
    if (activeLinkId === link.id) {
      setActiveLinkId(null);
      setFormData({
        link_icon: '',
        links: '',
        link_name: '',
        businessId: business_id,
      });
    } else {
      setActiveLinkId(link.id);
      setFormData(link);
    }
  };
const handleLinkchainDelete = async ()=>{
 setLoading(true);
    try {
      if (activeLinkId) {
        await axios.delete(`${BACKEND_API_URL}/api/v1/auth/linkchain/${activeLinkId}/`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
        );
      } 
      alert('Link chain Deleted');
      window.location.reload();
    } catch (error) {
      console.error('Error Deleting link chain:', error);
    } finally {
      setLoading(false);
    }
} 
  return (
    <div className="w-full">
      {links.length > 0 ? (
        <div className="my-4">
          <h1 className="text-[20px] font-bold">Link Chain</h1>
          <div className="flex flex-wrap my-2">
            {links.map((link) => (
              <button
                key={link.id}
                className={`flex items-center justify-center gap-2 border text-black font-bold py-2 px-4 rounded-3xl mr-4 mb-4 text-[14px] ${activeLinkId === link.id ? 'border-blue-500' : 'border-gray-300' }`}
                onClick={() => handleLinkSelect(link)}
              >
                <img src={link.link_icon} alt="logo" className="h-[16px] w-[16px] rounded-sm object-cover" />
                {link.link_name}
              </button>
            ))}
          </div>
          {activeLinkId && (
            <div className="w-full max-w-lg mx-auto p-4 rounded-lg shadow-lg border">
              <button className="text-[20px] float-right" onClick={() => setActiveLinkId(null)}>
                <FaTimes />
              </button>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 text-gray-700">Link Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {socialMediaIcons.map((icon) => (
                      <div
                        key={icon.id}
                        className={`flex items-center gap-2 cursor-pointer p-2 border ${
                          formData.link_icon === icon.social_media_icon ? 'border-blue-500' : 'border-gray-300'
                        }`}
                        onClick={() => handleSocialMediaSelection(icon.media_provider_icon, icon.media_provider_name)}
                      >
                        <img src={icon.media_provider_icon} alt={icon.media_provider_name} className="w-8 h-8" />
                        
                      </div>
                    ))}
                    <div
                      className="flex items-center gap-2 cursor-pointer p-2 border border-gray-300"
                      onClick={() => setIsCustomIcon(!isCustomIcon)}
                    >
                      <span>Others</span>
                    </div>
                  </div>
                  {errors.link_icon && <p className="text-red-500">{errors.link_icon}</p>}
                </div>
                {isCustomIcon && (
                  <div className="flex flex-col mb-4">
                    <label className="mb-2 text-gray-700">Custom Social Media Name</label>
                    <input
                      type="text"
                      value={customIconName}
                      onChange={(e) => setCustomIconName(e.target.value)}
                      className="p-2 border border-gray-300 rounded"
                    />
                    {errors.custom_social_media_name && <p className="text-red-500">{errors.custom_social_media_name}</p>}
                    <label className="mb-2 text-gray-700">Custom Social Media Icon</label>
                    <div className="flex items-center">
                      <div className="relative w-[40px] h-[40px]">
                        {customIconPreview && (
                          <img
                            src={customIconPreview || '/community.png'}
                            alt="social media"
                            className="object-cover w-full h-full"
                          />
                        )}
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
                  <label className="mb-2 text-gray-700">Link</label>
                  <input
                    type="text"
                    name="links"
                    value={formData.links}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded"
                  />
                  {errors.links && <p className="text-red-500">{errors.links}</p>}
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 text-gray-700">Link Name</label>
                  <input
                    type="text"
                    name="link_name"
                    value={formData.link_name}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded"
                  />
                  {errors.link_name && <p className="text-red-500">{errors.link_name}</p>}
                </div>
                <button
                  type="submit"
                  className={`w-full p-2 bg-blue-500 text-white rounded mt-4 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={handleLinkchainDelete}
                  className={`w-full p-2 bg-red-500 text-white rounded mt-4 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-[18px] text-gray-500 mb-4 text-center font-bold">No links available! Create new</h1>
        </div>
      )}
    </div>
  );
};

export default LinkChain;
