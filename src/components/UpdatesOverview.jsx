import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaEdit, FaTrash, FaPlus, FaYoutube } from 'react-icons/fa';

const UpdatesOverview = ({ data, business_id }) => {
  const [overviewData, setOverviewData] = useState(data);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    youtube_link: '',
    overview: '',
    businessId: parseInt(business_id, 10), // Ensure initial conversion here
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [noChanges, setNoChanges] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!formData.youtube_link || !youtubePattern.test(formData.youtube_link)) {
      newErrors.youtube_link = 'Please enter a valid YouTube URL.';
    }
    if (!formData.overview) {
      newErrors.overview = 'Overview is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNoChanges(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Ensure conversion and JSON-encoding right before the request
      const finalFormData = {
        ...formData,
        businessId: parseInt(formData.businessId, 10),
        overview: JSON.stringify(formData.overview) // Encode overview as JSON string
      };

      if (editingId) {
        const existingItem = overviewData.find(item => item.id === editingId);
        if (existingItem.youtube_link === formData.youtube_link && existingItem.overview === formData.overview) {
          setNoChanges(true);
          setLoading(false);
          return;
        }
        await axios.patch(`https://digicholabackendfinal.onrender.com/api/v1/auth/overview/${editingId}/`, finalFormData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
        );
        setOverviewData(overviewData.map(item => (item.id === editingId ? { ...item, ...formData, overview: formData.overview } : item)));
        setEditingId(null);
      } else {
        const response = await axios.post('https://digicholabackendfinal.onrender.com/api/v1/auth/overview/', finalFormData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
        );
        setOverviewData([...overviewData, response.data]);
      }

      setFormData({
        youtube_link: '',
        overview: '',
        businessId: parseInt(business_id, 10),
      });
      setFormVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ ...item, businessId: parseInt(business_id, 10) }); // Ensure conversion here
    setEditingId(item.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://digicholabackendfinal.onrender.com/api/v1/auth/overview/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }
      );
      setOverviewData(overviewData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      youtube_link: '',
      overview: '',
      businessId: parseInt(business_id, 10), // Ensure conversion here
    });
    setEditingId(null);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormData({
      youtube_link: '',
      overview: '',
      businessId: parseInt(business_id, 10), // Ensure conversion here
    });
    setEditingId(null);
    setFormVisible(false);
  };

  return (
    <div className="container w-full p-4 mt-4">
      <h2 className="text-2xl font-bold mb-4">Updates Overview</h2>
      <div className="space-y-4">
        {overviewData.map((item) => (
          <div key={item.id} className="min-w-[200px] p-4 border rounded shadow-sm flex justify-between items-center relative">
            <div>
              <a href={item.youtube_link} target="_blank" rel="noopener noreferrer" className="text-red-600 underline">
                <FaYoutube className='inline mr-2 w-6 h-6'/>
              </a>
              <p className='mt-2'>{item.overview}</p>
            </div>
            <div className="flex gap-2 absolute top-[10px] right-[10px]">
              <button onClick={() => handleEdit(item)} className="text-blue-500">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-red-500">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {!formVisible ? (
        <button
          onClick={handleAddNew}
          className="flex gap-2 items-center text-[20px] px-4 py-2 text-violet-color rounded-3xl border border-yellow-600 mt-4"
        >
          <FaPlus /> Add a New Overview
        </button>
      ) : (
        <div className="w-full max-w-lg mx-auto shadow-xl mt-6 rounded-lg border p-6 mb-6">
          <button className="text-[20px] float-right" onClick={handleCloseForm}>
            <FaTimes />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700 text-[14px] flex gap-2 items-center"><FaYoutube className='w-6 h-6'/>YouTube Link</label>
              <input
                type="text"
                name="youtube_link"
                value={formData.youtube_link}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              />
              {errors.youtube_link && <p className="text-red-500">{errors.youtube_link}</p>}
            </div>
            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Overview</label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              />
              {errors.overview && <p className="text-red-500">{errors.overview}</p>}
            </div>
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : editingId ? 'Update' : 'Create'}
            </button>
            {noChanges && <p className="text-red-500 mt-2">No changes made to the overview.</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdatesOverview;
