import React, { useState, useEffect, useCallback} from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye} from "react-icons/fa";
import axios from "axios";


const Login = () => {
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const  REACT_APP_GOOGLE_CLIENT_ID =  import.meta.env.VITE_GOOGLE
  const REACT_APP_GOGGLE_REDIRECT_URL_ENDPOINT = import.meta.env.VITE_BASE
  const [username, setUsername] = useState(localStorage.getItem('first_name'))
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = localStorage.getItem('token');
    const navigate=useNavigate()
    const [logindata, setLogindata]=useState({
        email:"",
        password:"",

    })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
      email: "",
      password: "",
    });
    const handleOnchange=(e)=>{
      const { name, value } = e.target;
      setLogindata({ ...logindata, [name]: value });
  
      // Validate email
      if (name === 'email') {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setErrors({ ...errors, email: isValid ? '' : 'Invalid email format' });
      }
      if (name === 'password') {
        const isValid = value.length >= 6;
        setErrors({ ...errors, password: isValid ? '' : 'Password must be at least 6 characters long' });
      }
    }
    useEffect(() => {
      if (isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticated, navigate]);
    useEffect(() => {
      const storedUsername = localStorage.getItem("user_goggle");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }, []);
    const openGoogleLoginPage = useCallback(() => {
        const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        
        const scope = [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ].join(" ");
        const params = new URLSearchParams({
            response_type: "code",
            client_id: REACT_APP_GOOGLE_CLIENT_ID,
            redirect_uri: `${REACT_APP_GOGGLE_REDIRECT_URL_ENDPOINT}/google`,
            prompt: "select_account",
            access_type: "online",
            scope,
          });
      
          const url = `${googleAuthUrl}?${params}`;      
          window.location.href = url;
        }, []);


        const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
            try {
              if (Object.values(errors).every(error => error === '')) {
              const res = await axios.post(`${BACKEND_API_URL}/api/v1/auth/login/`, logindata);
              const response = res.data;
              if (res.status === 200) {
                localStorage.setItem('token', JSON.stringify(response.access_token));
                localStorage.setItem('refresh_token', JSON.stringify(response.refresh_token));
                localStorage.setItem('userid', res.data.id);
                localStorage.setItem('email', res.data.email);
                localStorage.setItem('phone_number', res.data.phone_number);
                localStorage.setItem('is_verified',res.data.is_verified);
                localStorage.setItem('first_name', res.data.first_name);
                localStorage.setItem('last_name', res.data.last_name);
                localStorage.setItem('profile_pic', res.data.profile_pic);
                localStorage.setItem('is_business_user', res.data.is_business_user);
                navigate('/');
                window.location.href = '/';
                window.location.reload(true);
                
              }
              } else {
                // Display error toast or handle errors appropriately
               alert('Please fix the form errors before submitting');
              }
            } catch (error) {
              if (error){
                        
                setErrors({ email: "incorrect please check", password: "incorrect please check" });
              }
              // Handle error
              console.error('An error occurred:', error);
              // Display error toast or handle errors appropriately
              alert('Check the email and password you entered is incorrect');
            }finally {
              setLoading(false);
            }
          };
          
  return (
    <div className='login-bg'>
        <div className='form-container mt-10'>
            <div style={{width:"100%"}} className='wrapper'>
            <div className='flex flex-col items-center'>
              <img src='https://res.cloudinary.com/dybwn1q6h/image/upload/v1715572132/favicon_tmeqwo.png' className='w-[40px] h-[40px]'></img>
            <p className='login-title'> Login </p>
          </div>
          {errors.message && <span className="error">Your email or password was incorrect</span>}
            <form action="" onSubmit={handleSubmit}>
            <div className='form-group'>

          <input
            type="text"
            className={`email-form ${errors.email && 'invalid'}`}
            value={logindata.email}
            name="email"
            placeholder='E-mail Address'
            onChange={handleOnchange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className='form-group'>
          <input
            type={showPassword ? "text" : "password"}
            className={(errors.password) ? 'invalid' : 'email-form'}
            value={logindata.password}
            name="password"
            placeholder='Password'
            onChange={handleOnchange}
          />
          {showPassword ? (
                        <FaEyeSlash
                          className="passHide"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <FaEye
                          className="passHide"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
          {errors.password && <span className="error">{errors.password}</span>}
          
        </div>
                      <p className='pass-link'><Link to={'/forget_password'}>forgot password?</Link></p>
                      <input type="submit" value={loading ? "Logging in..." : "Login"} className="submitButton" disabled={loading} />
                                
                        </form>
                        <div className="popup-container">
                          <div className="line"></div>
                          <div className="or">or</div>
                          <div className="line"></div>
                        </div>

                        <div className="google-button">

              {!username &&  <button
                  
                  className="bg-white text-gray-800 font-bold py-2 px-4 border rounded-full shadow  focus:outline-none "
                  onClick={openGoogleLoginPage}
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      width="30px"
                      height="20px"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    Sign in with Google
                  </div>
                </button>
            
              }
            </div>
                  <div className='singup-msg'>
                    <p>Don’t have an account? <Link to="/register">Sign up</Link></p>
                    
                  </div>

                  </div>
                </div>

    </div>
  )
}

export default Login