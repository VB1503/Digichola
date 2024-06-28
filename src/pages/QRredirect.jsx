import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function QRredirect() {
  const { chunk } = useParams();
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRedirectUrl = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/api/v1/auth/qrredirect/${chunk}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.qr_redirect_link) {
          window.location.href = data.qr_redirect_link;
        } else {
          console.error('QR redirect link not found in the response');
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRedirectUrl();
  }, [chunk]);

  return (
    <div>
      {loading ? (
        <center className="w-full h-[80vh] flex items-center justify-center"><span className="text-violet-700 font-bold text-[20px]">Loading<span className="text-yellow-600">...</span></span></center>
      ) : (
        <center className="w-full h-[80vh] flex items-center justify-center"><span className="text-violet-700 font-bold text-[20px]">Redirecting<span className="text-yellow-600">...</span></span></center>
      )}
    </div>
  );
}

export default QRredirect;
