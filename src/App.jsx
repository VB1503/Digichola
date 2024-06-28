import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import axios from 'axios';
import './App.css';
import './Home.css';
import './SearchBar.css';
import './BusinessCard.css';
import SocialAuth from './pages/social-auth/SocialAuth'
import "./App.css"
import "./login.css"
import "./Newscard.css"
import "./mailus.css"
import "./Register.css"
import "./otp.css"
import Home from './Home';
import Footer from './Footer';
import CategorySelected from './pages/CategoriesSelected';
import SearchResult from "./pages/SearchPage"
import ProfileView from './pages/BusinessProfileView';
import Favourites from './pages/Favourites';
import SubCategoriesList from './pages/SubCategory';
import VerifyOtp from './pages/auth/VerifyOtp';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgetPassword from './pages/auth/ForgetPassword';
import ResetPassword from './pages/auth/ResetPassword';
import More from './pages/More';
import Settings from './pages/Settings';
import ProfileOption from './pages/ProfileOption';
import QrReader from './pages/QRScanner';
import BusinessSettings from './pages/BusinessSettings';
import AddBusiness from './pages/AddBusiness';
import EditBusiness from './pages/EditBusiness';
import QRredirect from './pages/QRredirect';
import Explore from './pages/Explore';

function App() {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('token');

    // Run only if both tokens are present
    if (!refreshToken || !accessToken) {
      return;
    }

    const parsedRefreshToken = JSON.parse(refreshToken);

    const refreshAccessToken = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_URL}/api/v1/auth/token/refresh/`, {
          refresh: parsedRefreshToken,
        });
        const newAccessToken = response.data.access;
        localStorage.setItem('token', newAccessToken);
      } catch (error) {
        console.error('Failed to refresh access token:', error);
      }
    };

    const logout = async () => {
        localStorage.clear();
        window.location.href = '/login'; // Adjust this according to your app's routing
        console.error('Failed to log out:', error);
    };

    const checkTokenExpiry = async () => {
      const currentAccessToken = localStorage.getItem('token');
      const currentRefreshToken = localStorage.getItem('refresh_token');

      if (!currentAccessToken || !currentRefreshToken) {
        return;
      }

      try {
        const decodedAccessToken = jwtDecode(currentAccessToken); // Decode the access token
        const decodedRefreshToken = jwtDecode(JSON.parse(currentRefreshToken)); // Decode the refresh token
        const currentTime = Math.floor(Date.now() / 1000);

        const accessTokenExpiry = decodedAccessToken.exp;
        const refreshTokenExpiry = decodedRefreshToken.exp;

        const accessTokenBuffer = 60; // Refresh access token 1 minute before expiry
        const refreshTokenBuffer = 24 * 60 * 60; // Logout 1 day before refresh token expiry

        if (accessTokenExpiry - currentTime <= accessTokenBuffer) {
          await refreshAccessToken();
        }

        if (refreshTokenExpiry - currentTime <= refreshTokenBuffer) {
          await logout();
        }
      } catch (error) {
        console.error('Failed to decode tokens:', error);
      }
    };

    checkTokenExpiry(); // Initial check on component mount

    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);


  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/google" element={<SocialAuth />} />
          <Route path="/otp/verify" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/forget_password' element={<ForgetPassword />} />
          <Route path='/password-reset-confirm/:uid/:token' element={<ResetPassword />} />
          <Route
            path="/category/:categorySelected/"
            element={<CategorySelected />}
          />
          <Route
            path="/profile/:page/:category/:business_id/"
            element={<ProfileView />}
          />
          <Route
            path="/:chunk/"
            element={<QRredirect />}
          />
          <Route
            path="/favourites"
            element={<Favourites />}
          />

          <Route
            path="/categories_list"
            element={<More />}
          />
          <Route
            path="/user/settings"
            element={<Settings />}
          />
          <Route
            path="/business/settings"
            element={<BusinessSettings />}
          />
          <Route
            path="/show_options"
            element={<ProfileOption />}
          />
          <Route
            path="/add_business"
            element={<AddBusiness />}
          />
          <Route
            path="/edit_business/:business_id/"
            element={<EditBusiness />}
          />
          <Route
            path="/DcScan"
            element={<QrReader />}
          />
          <Route path="/category/:id/:category" element={<SubCategoriesList />} />
          <Route
            path="/Search/:categorySelected/"
            element={<SearchResult />}
          />
          <Route
            path="/Explore"
            element={<Explore />}
          />
        </Routes>
        <div className='foot-nav'>
        <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
