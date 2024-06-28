import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getRecentSearches, addRecentSearch } from './localStorageUtil';

const SearchBar = () => {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryRes = await axios.get(`${BACKEND_API_URL}/search/categories`);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    // Load recent searches from local storage when component mounts
    setRecentSearches(getRecentSearches().slice(0, 10));
  }, []);

  const onInputChange = (event) => {
    setSearchValue(event.target.value);
    setShowSuggestions(event.target.value.trim() !== '');
    if (event.target.value.trim() !== '') {
      onSearch(event.target.value);
    } else {
      setSuggestions([]);
    }
  };

  const onSearch = async (query) => {
    try {
      const latitude = localStorage.getItem('latitude');
      const longitude = localStorage.getItem('longitude');
      let apiUrl = `${BACKEND_API_URL}/search/search/?query=${query}`;
      if (latitude && longitude) {
        apiUrl += `&user_location=${latitude},${longitude}`;
      }

      const res = await axios.get(apiUrl);
      const businesses = res.data.map(item => ({
        id: item.business_id,
        name: item.business_name,
        profilePic: item.business_profile,
        place: 'Business'
      }));

      const categoriesMatchingQuery = categories.filter(cat => cat.category.toLowerCase().includes(query.toLowerCase()));
      const categorySuggestions = categoriesMatchingQuery.map(cat => ({
        id: cat.id,
        name: cat.category,
        profilePic: cat.categoryImage,
        place: 'Category'
      }));

      const allSuggestions = [...categorySuggestions, ...businesses].slice(0, 8);
      setSuggestions(allSuggestions);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion.name);
    setShowSuggestions(false); // Close suggestions
    addRecentSearch(suggestion.name);
    setRecentSearches(getRecentSearches().slice(0, 10));

    if (suggestion.place === 'Category') {
      navigate(`/Category/${suggestion.name}`);
    } else {
      navigate(`/profile/search/${suggestion.name}/${suggestion.id}`);
    }
  };

  const handleRecentSearchClick = (search) => {
    setSearchValue(search);
    setShowSuggestions(false); // Close suggestions
    navigate(`/Search/${search}`);
  };

  const handleSearchIconClick = () => {
    setShowSuggestions(false);
    if (searchValue.trim() !== '') {
      addRecentSearch(searchValue);
      setRecentSearches(getRecentSearches().slice(0, 10));
      const isCategory = categories.some(cat => cat.category.toLowerCase() === searchValue.toLowerCase());
      if (isCategory) {
        navigate(`/Category/${searchValue}`);
      } else {
        navigate(`/Search/${searchValue}`);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchIconClick();
    }
  };

  const cleanSearchString = (search) => {
    const timestampIndex = search.search(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    return timestampIndex !== -1 ? search.slice(0, timestampIndex) : search;
  };

  return (
    <div className="mt-1 w-full relative search-cont">
      <div className='flex items-center'>
        <div className='search-bar shadow-lg'>
          <input
            type="text"
            value={searchValue}
            onChange={onInputChange}
            onKeyDown={handleKeyPress} // Handle key press event
            placeholder="Doctor, Restaurants, Fitness"
            className="w-full rounded-lg py-[8px] pr-[10px] pl-[14px] border focus:outline-none focus:border-blue-500 relative search-in"
          />
          <div
            className="absolute right-2 top-[9px] text-gray-400 text-[12px] p-[6px] rounded-md cursor-pointer"
            style={{ backgroundColor: '#554CBC' }}
            onClick={handleSearchIconClick}
          >
            <FaSearch className='text-white' />
          </div>
        </div>
      </div>
      {showSuggestions && (
        <ul className="w-[100%] absolute bg-white border border-gray-300 rounded-md mt-1 max-h-[400px] overflow-y-auto z-[1000]">
          {recentSearches.length > 0 && (
            <>
              <li className="px-3 py-2 bg-gray-100 font-semibold">Recent</li>
              <div className="flex flex-wrap px-3 py-2">
                {recentSearches
                  .filter(search => search.business_name || search[0]) // Filter to keep only relevant objects
                  .map((search, index) => {
                    const searchString = search.business_name 
                      ? search.business_name 
                      : cleanSearchString(Object.values(search).join(''));

                    return (
                      <div
                        key={index}
                        className="border border-gray-200 px-3 py-1 mr-2 mb-2 cursor-pointer hover:bg-gray-100 rounded"
                        onClick={() => handleRecentSearchClick(searchString)}
                      >
                        {searchString}
                      </div>
                    );
                  })}
              </div>
            </>
          )}

          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="border-b border-gray-100 px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center">
                <img
                  src={suggestion.profilePic}
                  alt={suggestion.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <div className="text-left font-semibold">{suggestion.name}</div>
                  <div className="text-left text-sm text-gray-500">{suggestion.place}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
