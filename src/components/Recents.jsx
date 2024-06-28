import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentSearches } from './localStorageUtil';
import { format } from 'date-fns';
import axios from 'axios';
import { CiShare1 } from 'react-icons/ci';
import './Recents.css';

function Recents() {
  const [recentData, setRecentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const searches = getRecentSearches().slice(0, 10);
        const validSearches = searches.filter(
          data =>
            data.business_name &&
            data.business_id &&
            data.business_phone_number &&
            data.description
        );

        setRecentData(validSearches);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching recent searches:', error);
        setIsLoading(false); // Handle error gracefully
      }
    };

    fetchRecentSearches();
  }, []);

  return (
    <div className="recents-container">
      <h4 className="text-[28px] font-bold my-6 md:text-left text-center">
        Recently Viewed
      </h4>
      <ul className="recents-list">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <li key={index} className="recent-item">
              <SkeletonLoader />
            </li>
          ))
        ) : recentData.length === 0 ? (
          <div className="no-recent-data">
            Recent Histories will be Displayed here...
          </div>
        ) : (
          recentData.map((data, index) => (
            <RecentItem key={index} data={data} />
          ))
        )}
      </ul>
    </div>
  );
}

function RecentItem({ data }) {
  const navigate = useNavigate();
  return (
    <li className="recent-item shadow-sm border relative">
      <CiShare1
        className="absolute right-3 top-2 cursor-pointer"
        onClick={() =>
          navigate(`/profile/home/${data.category}/${data.business_id}/`)
        }
      />
      <div className="profile-container">
        <img
          src={data.business_profile}
          alt={`${data.business_name} Profile`}
          className="profile-image"
        />
        <div className="profile-details">
          <div className="business-name">{data.business_name}</div>
          <div className="business-place">{data.place}</div>
        </div>
      </div>
      <div className="business-info">
        <button
          className="call-btn font-bold"
          onClick={() => window.open(`tel:${data.business_phone_number}`)}
        >
          <img
            className="w-[18px] h-[18px] bg-white rounded-full"
            src="https://cdn-icons-png.flaticon.com/128/5585/5585856.png"
            alt="call"
          />
          Call now
        </button>
        <div className="text-[12px] text-center mt-4">
          <span className="text-blue-800 font-bold">Searched On:</span>{' '}
          {format(new Date(data.timestamp), 'PPPpp')}
        </div>
      </div>
    </li>
  );
}

function SkeletonLoader() {
  return (
    <div className="recent-item shadow-sm border relative animate-pulse w-[300px]">
      <div className="profile-container">
        <div className="profile-image bg-gray-300 h-10 w-10 rounded-full"></div>
        <div className="profile-details">
          <div className="business-name bg-gray-300 h-4 w-3/4 mb-2"></div>
          <div className="business-place bg-gray-300 h-3 w-1/2"></div>
        </div>
      </div>
      <div className="business-info mt-4">
        <div className="description bg-gray-300 h-6 w-full mt-4"></div>
        <div className="call-btn bg-gray-300 h-10 w-1/2 mt-4"></div>
      </div>
    </div>
  );
}

export default Recents;
