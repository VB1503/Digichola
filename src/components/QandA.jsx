import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const QnAComponent = ({ data, business_id }) => {
  const [qnaData, setQnaData] = useState(data);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    custom_description: '',
    businessId: business_id,
  });
  const [originalData, setOriginalData] = useState(null); // Store original data for comparison
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.title || !formData.custom_description) {
      setError('Please fill out all fields.');
      return false;
    }
    if (editingId && originalData && JSON.stringify(formData) === JSON.stringify(originalData)) {
      setError('No changes made.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.patch(`https://digicholabackendfinal.onrender.com/api/v1/auth/customdescription/${editingId}/`, formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
        );
        setQnaData(qnaData.map(item => (item.id === editingId ? { ...item, ...formData } : item)));
        setEditingId(null);
        setOriginalData(null);
        
      } else {
        const response = await axios.post('https://digicholabackendfinal.onrender.com/api/v1/auth/customdescription/', formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
        );
        setQnaData([...qnaData, response.data]);
      }
      setFormData({
        title: '',
        custom_description: '',
        businessId: business_id,
      });
      setFormVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (qna) => {
    setFormData(qna);
    setOriginalData(qna); // Store original data for comparison
    setEditingId(qna.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://digicholabackendfinal.onrender.com/api/v1/auth/customdescription/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }
      );
      setQnaData(qnaData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting Q&A:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      title: '',
      custom_description: '',
      businessId: business_id,
    });
    setOriginalData(null);
    setEditingId(null);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormData({
      title: '',
      custom_description: '',
      businessId: business_id,
    });
    setOriginalData(null);
    setEditingId(null);
    setFormVisible(false);
    setError('');
  };

  return (
    <div className="container w-full p-4">
      <h2 className="text-2xl font-bold mb-4">Q&A</h2>
      <div className="space-y-6">
        {qnaData.map((qna) => (
          <div key={qna.id} className="p-4 border rounded shadow-sm flex justify-between items-center relative">
            <div>
              <h3 className="text-xl font-semibold mt-2">{qna.title}</h3>
              <p className='mt-2'>{qna.custom_description}</p>
            </div>
            <div className="flex gap-2 absolute top-[10px] right-[10px]">
              <button onClick={() => handleEdit(qna)} className="text-blue-500">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(qna.id)} className="text-red-500">
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
          <FaPlus /> Add a New Q&A
        </button>
      ) : (
        <div className="w-full max-w-lg mx-auto shadow-xl mt-6 rounded-lg border p-6 mb-6">
          <button className="text-[20px] float-right" onClick={handleCloseForm}>
            <FaTimes />
          </button>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Description</label>
              <textarea
                name="custom_description"
                value={formData.custom_description}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : editingId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QnAComponent;
