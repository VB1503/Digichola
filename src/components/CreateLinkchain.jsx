import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaPlus } from 'react-icons/fa';
import LinkChain from './LinkChain';

const CreateLinkChain = ({ data, business_id }) => {
  const [formVisible, setFormVisible] = useState(true);
  const [formData, setFormData] = useState({
    link_icon: '',
    links: '',
    link_name: '',
    businessId: business_id,
  });
  const [loading, setLoading] = useState(false);
  const [socialMediaIcons, setSocialMediaIcons] = useState([]);
  const [isCustomIcon, setIsCustomIcon] = useState(false);
  const [customIconPreview, setCustomIconPreview] = useState(null);
  const [customIconName, setCustomIconName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSocialMediaIcons = async () => {
      try {
        const response = await axios.get('https://digicholabackendfinal.onrender.com/api/v1/auth/linkchain-media-icons/');
        setSocialMediaIcons(response.data);
      } catch (error) {
        console.error('Error fetching social media icons:', error);
      }
    };

    fetchSocialMediaIcons();
  }, []);

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
      const response = await axios.post('https://digicholabackendfinal.onrender.com/api/v1/auth/linkchain-media-icons/', {
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
      if (image){
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'jvvslzla');
      data.append('cloud_name', 'dybwn1q6h');
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dybwn1q6h/image/upload',
        data
      );
      return response.data.url;
    }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('https://digicholabackendfinal.onrender.com/api/v1/auth/linkchain/', formData,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }
      );
      alert('Link chain created successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error creating link chain:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container w-full p-2">
      <LinkChain data={data} business_id={business_id} />
      {!formVisible ? (
        <button
          onClick={() => setFormVisible(true)}
          className="flex gap-2 items-center text-[20px] px-4 py-2 text-blue-700 rounded-xl border border-blue-800"
        >
          <FaPlus /> Create a New Link Chain
        </button>
      ) : (
        <div className="w-full max-w-lg mx-auto shadow-xl mt-6 rounded-lg border p-6 mb-6">
          <button className="text-[20px] float-right" onClick={() => setFormVisible(false)}>
            <FaTimes />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Link Icon</label>
              <div className="flex flex-wrap gap-2">
                {socialMediaIcons.map((icon) => (
                  <div
                    key={icon.id}
                    className={`flex items-center gap-2 cursor-pointer p-2 border ${formData.link_icon === icon.media_provider_icon ? 'border-blue-500' : 'border-gray-300'}`}
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
                <label className="mb-2 text-gray-700">Custom Icon Name</label>
                <input
                  type="text"
                  name="custom_social_media_name"
                  value={customIconName}
                  onChange={(e) => setCustomIconName(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
                {errors.custom_social_media_name && <p className="text-red-500">{errors.custom_social_media_name}</p>}
                <label className="mb-2 text-gray-700">Custom Icon</label>
                <div className="flex items-center">
                  <div className="relative w-[40px] h-[40px] bg-slate-300">
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
                    className="ml-4 mb-0 p-2 bg-blue-500 text-white rounded cursor-pointer"
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
              className={`w-full p-2 bg-blue-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating Link Chain...' : 'Create'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateLinkChain;
