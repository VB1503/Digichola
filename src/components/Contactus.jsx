import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = ({ showModal, onClose }) => {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name.trim()) {
      formErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) {
      formErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      formErrors.message = 'Message must be at least 10 characters';
    }
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_API_URL}/api/v1/auth/contactmailing/`, formData);
      if (response.status === 200) {
        setFormStatus('Your message has been sent successfully!');
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        setFormStatus('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('There was an error sending your message. Please try again.');
    }
  };

  return (
    <div className={`modal-mailus ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="container mx-auto">
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6 text-black">Contact Us</h1>
            <p className="mb-6 text-black">
              We're here to help! Whether you have questions, feedback, or need customer support, feel free to reach out to us. Please fill out the form below to send us a message.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Your Name'
                  className="border rounded-lg p-2 text-black"
                  required
                />
                {errors.name && <span className="text-red-600">{errors.name}</span>}
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border rounded-lg p-2 text-black"
                  placeholder='Email Address (we will replay to this email)'
                  required
                />
                {errors.email && <span className="text-red-600">{errors.email}</span>}
              </div>
              <div className="flex flex-col">
                <label htmlFor="message" className="mb-1 font-semibold">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="border rounded-lg p-2 h-32 text-black"
                  placeholder='Type your Request/Query here...'
                  required
                />
                {errors.message && <span className="text-red-600">{errors.message}</span>}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg p-2 font-semibold hover:bg-blue-700 transition duration-200"
              >
                Send Message
              </button>
              {formStatus && <p className="mt-4 text-center text-green-600">{formStatus}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
