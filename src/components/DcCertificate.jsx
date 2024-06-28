import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Certificate = ({ data, business_id }) => {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const [certificateData, setCertificateData] = useState(data.length > 0 ? data[0] : null);
  const [formVisible, setFormVisible] = useState(data.length === 0);
  const [formData, setFormData] = useState({
    certificate: '',
    businessId: business_id,
  });
  const [loading, setLoading] = useState(false);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [noChanges, setNoChanges] = useState(false);

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    setCertificatePreview(URL.createObjectURL(file));
    setFormData({ ...formData, certificate: file });
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.certificate) newErrors.certificate = "Certificate image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setNoChanges(false);
    try {
      const certificateUrl = await uploadImage(formData.certificate);
      const finalFormData = { ...formData, certificate: certificateUrl };

      if (certificateData) {
        if (certificateData.certificate === certificateUrl) {
          setNoChanges(true);
          setLoading(false);
          return;
        }
        await axios.patch(`${BACKEND_API_URL}/api/v1/auth/dccertification/${certificateData.id}/`, finalFormData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
        );
        setCertificateData({ ...certificateData, ...finalFormData });
      } else {
        const response = await axios.post(`${BACKEND_API_URL}/api/v1/auth/dccertification/`, finalFormData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
        );
        setCertificateData(response.data);
      }

      setFormData({
        certificate: '',
        businessId: business_id,
      });
      setFormVisible(false);
      setCertificatePreview(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setFormVisible(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${BACKEND_API_URL}/api/v1/auth/dccertification/${certificateData.id}/`);
      setCertificateData(null);
      setFormVisible(true);
    } catch (error) {
      console.error('Error deleting certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container w-full p-2 mt-10">
      <h2 className="text-2xl font-bold mb-4">Certificate</h2>
      {certificateData ? (
        <div className="p-4 border rounded shadow-xl flex flex-col items-center w-full">
          <img src={certificateData.certificate} alt="Certificate" className="h-64 mb-4 object-cover" />
          <p>Issued Date: {new Date(certificateData.issued_date).toLocaleDateString()}</p>
          <div className="flex space-x-2 mt-4">
            <button onClick={handleEdit} className="text-blue-500 flex items-center gap-2">
              <FaEdit /> Edit
            </button>
            <button onClick={handleDelete} className="text-red-500 flex items-center gap-2">
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ) : (
        !formVisible && (
          <button
            onClick={() => setFormVisible(true)}
            className="flex gap-2 items-center text-[20px] px-4 py-2 text-violet-color rounded-3xl border border-yellow-600"
          >
            <FaPlus /> Upload Certificate
          </button>
        )
      )}

      {formVisible && (
        <div className="w-full max-w-lg mx-auto shadow-xl mt-6 rounded-lg border p-6 mb-6">
          <button className="text-[20px] float-right" onClick={() => setFormVisible(false)}>
            <FaTimes />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <label className="mb-2 text-gray-700">Certificate Image</label>
              <div className="flex flex-col gap-2 items-center">
                {certificatePreview && (
                  <div className="relative w-auto h-[150px]">
                    <img
                      src={certificatePreview}
                      alt="Certificate Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCertificateChange}
                  className="hidden"
                  id="certificateUpload"
                />
                <label
                  htmlFor="certificateUpload"
                  className="ml-4 p-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                  Choose Image
                </label>
                {errors.certificate && <p className="text-red-500">{errors.certificate}</p>}
              </div>
            </div>
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            {noChanges && <p className="text-red-500 mt-2">No changes made to the certificate.</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default Certificate;
