import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';

function More() {
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get('https://digicholabackendfinal.onrender.com/search/categories');
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchIconClick = () => {
    // Add any specific logic for search icon click if needed
  };

  const filteredCategories = categories.filter(category =>
    category.category.toLowerCase().includes(searchInput.toLowerCase())
  );

  const renderCategory = (category) => {
    return (
      <div
        key={category.id}
        className="category-container flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
        onClick={() => navigate(`/category/${category.category}`)}
      >
        <div className="category-image">
          <img src={category.categoryImage} alt={category.category} className="max-w-[80px] max-h-[80px] object-cover rounded-md" />
        </div>
        <span className="category-name block mt-2 text-center text-gray-800 font-medium">{category.category}</span>
      </div>
    );
  };

  const renderSubcategories = (parentId) => {
    const subcategories = categories.filter(category => category.parent === parentId);
    if (subcategories.length === 0) return null;

    return (
      <div className="subcategory-container flex flex-wrap gap-5 mt-4">
        {subcategories.map(subcategory => renderCategory(subcategory))}
      </div>
    );
  };

  const renderCategories = (categoriesToRender) => {
    return categoriesToRender.filter(category => !category.parent).map(category => (
      <div key={category.id} className="mb-8">
        <div
          className="flex gap-4 items-center mb-4 cursor-pointer"
          onClick={() => navigate(`/category/${category.category}`)}
        >
          <img src={category.categoryImage} alt={category.category} className="max-h-[40px] w-[40px] object-cover rounded-md" />
          <h2 className="text-lg font-semibold text-gray-800">{category.category}</h2>
        </div>
        {renderSubcategories(category.id)}
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center relative">
        <div
        title='go back'
          className="mr-4 text-gray-400 text-lg p-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft className='text-white' />
        </div>
        <div className="search-bar-container flex items-center relative flex-grow">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search categories"
            className="search-bar border border-gray-300 focus:outline-none focus:border-blue-500 p-3 w-full rounded-md shadow-sm"
          />
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg p-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            onClick={handleSearchIconClick}
          >
            <FaSearch className='text-white' />
          </div>
        </div>
      </div>
      <div className="categories-container mt-6">
        {searchInput && filteredCategories.length === 0 ? (
          <div className="w-full flex items-center justify-center py-10">
            <span className="text-blue-700 font-bold text-lg">
              No categories available
            </span>
          </div>
        ) : categories.length === 0 ? (
          <div className="w-full flex items-center justify-center py-10">
            <span className="text-blue-700 font-bold text-lg">
              Loading<span className="text-yellow-600">...</span>
            </span>
          </div>
        ) : (
          renderCategories(searchInput ? filteredCategories : categories)
        )}
      </div>
    </div>
  );
}

export default More;
