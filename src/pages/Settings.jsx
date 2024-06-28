import React, { useState, useEffect } from 'react';
import { FaCog } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom'
import { ChevronLeft} from "lucide-react";
import './ProfileUpdate.css';
import { AiOutlineSetting,AiOutlineDelete, AiOutlineUpload } from 'react-icons/ai';
import { FaEdit, FaUser, FaExclamationCircle} from 'react-icons/fa'; 
import VerifyOtp from './auth/VerifyOtp';
import axios from 'axios'; 
function Settings() {
  const navigate = useNavigate();
  const handleback =()=>{
    navigate('/show_options')
  }
  const [image, setImage] = useState("");
  const [otp, setOtp] = useState(false);
  const is_verified = localStorage.getItem('is_verified');
  const [errors, setErrors] = useState({
    email: "",
    phone_number: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const first_name = localStorage.getItem('first_name')
  const last_name = localStorage.getItem('last_name')
  const phone_number = localStorage.getItem('phone_number');
  const email = localStorage.getItem('email')
  const [profile, setProfile] = useState(localStorage.getItem('profile_pic'));
  const [uploaded, setUploaded] = useState(false)
  const isAuthenticated = localStorage.getItem('token');
  const [Phone, setPhone] = useState(phone_number)
  const [verifybox, Openbox] = useState("")
  const [userData, setUserData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  const handleLogout = ()=>{
    localStorage.clear();
    navigate('/login')
  }
  
  const handleDeleteConfirmation = async () => {
    setShowDeleteModal(false);
    try {
      const userId = localStorage.getItem('userid');
      const res = await axios.delete(
        `https://digicholabackendfinal.onrender.com/api/v1/auth/update-user/${userId}/`,
       // Pass updated userData here
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
      );
  
      if (res.status === 204) {
        localStorage.setItem('email', '');
        localStorage.setItem('first_name', '');
        localStorage.setItem('last_name', '');
        localStorage.setItem('userid', '');
        localStorage.setItem('token', '');
        localStorage.setItem('phone_number','');
        localStorage.setItem('profile_pic', '');
        localStorage.setItem('is_verified','');
        localStorage.setItem('refresh_token','')
        localStorage.clear();
        navigate('/register')
        window.location.reload(true);
      }
    } catch (error) {
      console.log(error)
    }

  };

  const handleChangePassword = async(e)=>{
    e.preventDefault()
    if (email) {
      const res = await axios.post('https://digicholabackendfinal.onrender.com/api/v1/auth/changePassword/', {'email': email},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
      )
      console.log(res)
       if (res.status === 200) {
        const response = res.data
        console.log(response)
        const uidb64 = response['uidb64']
        const token = response['token']
        navigate(`/password-reset-confirm/${uidb64}/${token}`);
        
       } 
    }
    
    
 }
console.log(is_verified)
  useEffect(() => {
    setPhone(phone_number)
    setUserData({
      email,
      first_name,
      last_name,
    });
  }, [email,first_name,last_name,phone_number]);

  const handleOnchangePh = (e) => {
    const value = e.target.value;
    setPhone(value);
    if (phone_number) {
      const isValid = /^\d{10}$/.test(value);
      setErrors({ ...errors, phone_number: isValid ? '' : 'Phone Number must be 10 digit' });
    }
    
  }
  console.log(is_verified)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
    if (name === 'email') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setErrors({ ...errors, email: isValid ? '' : 'Invalid email format' });
    }
  };
  const RemoveImage = () =>{
    localStorage.setItem('profile_pic', 'https://res.cloudinary.com/dybwn1q6h/image/upload/v1712654306/profile_default_arc6ar.jpg');
    setProfile('https://res.cloudinary.com/dybwn1q6h/image/upload/v1712654306/profile_default_arc6ar.jpg')
    handleProfileSubmit();
  }
  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "jvvslzla");
    data.append("cloud_name", "dybwn1q6h");
    fetch("https://api.cloudinary.com/v1_1/dybwn1q6h/image/upload", {
      method: "post",
      body: data
    })
      .then(resp => resp.json())
      .then(data => {
        setProfile(data.url);
        setUploaded(true)
        localStorage.setItem('profile_pic', data.url);

      })
      .catch(err => console.log('Error in Uploading Image'));
  };
  const handleUpdateSubmit = async () => {
    try {
      const userId = localStorage.getItem('userid');
      const res = await axios.patch(
        `https://digicholabackendfinal.onrender.com/api/v1/auth/update-user/${userId}/`,
        userData, // Pass updated userData here
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
      );
  
      if (res.status === 200) {
        localStorage.setItem('email', userData.email);
        localStorage.setItem('first_name', userData.first_name);
        localStorage.setItem('last_name', userData.last_name);
        window.location.reload(true);
      }
    } catch (error) {
      console.log('An error occurred while updating profile');
    }
  };


  const handleProfileSubmit = async () => {
    try {
      const userId = localStorage.getItem('userid');
      const res = await axios.patch(
        `https://digicholabackendfinal.onrender.com/api/v1/auth/update-user/${userId}/`,
        { 'profile_pic': profile },
        {
         headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
        }
      );

      if (res.status === 200) {
        
        window.location.reload(true);
      }
    } catch (error) {
      console.log('An error occurred while updating profile picture');
    }
  };

  if (uploaded){
    handleProfileSubmit();
 }
 const clickBack = () => {
    navigate("/user/profile");
  };
   const handlePhoneChange = async () =>{
    try {
      const userId = localStorage.getItem("userid");
      console.log(phone_number)
      const res = await axios.post(
        'https://digicholabackendfinal.onrender.com/api/auth/phoneNumber/',
        { 'user': parseInt(userId, 10), "phone_number": Phone},
        {
         headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
        }
      );

      if (res.status === 200) {
        setOtp(true);
        Openbox("open");
        localStorage.setItem('phone_number',Phone)
        localStorage.setItem('is_verified', false)
      }
    }catch (error) {
      if (error){
        setErrors({...errors,phone_number: 'This Phone Number is Already taken'});
      }
      console.log(error);
    }
   };
  return (
    <div>
      <div className=" fixed z-10 w-full top-0 py-2 bg-white">
          <div className="flex items-center justify-between py-3 sm:py-5 ">
            <button onClick={handleback} className="ml-[20px]">
              <ChevronLeft className="sm:w-[50px] sm:h-[30px]" />
            </button>
            <div className="card-business-name text-[20px] flex items-center gap-[8px]">User Settings
            </div>

            <button  className="mr-[20px] p-[10px] shadow-lg rounded-lg">
              <FaCog className="text-[20px] font-bold text-violet-700" />
            </button>
          </div>
       </div>
       <div>
        <div className='prof-update'>
            <div className='prof-info-cont mt-20'>
              <div className='profile-view'>
                <div className='prof-image-view'>
                    <img src={profile} alt="Uploaded"/>
                    <div className='user-gist'>
                        <p className='username'>{first_name} {last_name}</p>
                        <p className='email'>{email}</p>
                    </div>
                </div>
                  {phone_number ? (
                    <div className='prof-phone-info'>
                          <p className='info-phone'>{phone_number} </p>
                          {is_verified === 'true' ? (
                               <p className='fa-check'>&#10003; Verified</p>
                          ):(
                            <p style={{color:"red", fontSize:"12px"}}>	&#10060; Not Verified</p>
                          )}
                         
                    </div>
                  ):(
                    <div className='prof-phone-info'>
                      <p className='info-phone'>Phone Number</p>
                      <p style={{color:"red", fontSize:"12px"}}>	&#10060; Not Verified</p>
                    </div>
                  )
                  
                  }
              </div>
            </div>
            <div className='prof-mod-cont'>
                <div className='prof-left'>
                    <div className='update-fields-cont'>
                          <div className='form-head'>
                            <AiOutlineSetting />
                            <h1>Edit Info</h1>
                          </div>
                          
                          <div className="form-group">
                            <label className='upload-label'>{phone_number ? (<span>Change Phone Number</span>):(<span>Add Phone Number</span>)}</label>
                            <div className='update-ph-div'>
                            <input type="text" name="phone_number" value={Phone} onChange={handleOnchangePh} placeholder='Phone Number' className='updatePhonefill'/>
                            {phone_number ? (
                              <button type="submit" onClick={handlePhoneChange} className='update-btn'>Change</button>
                            ):(
                              <button type="submit" onClick={handlePhoneChange} className='update-btn'>Add</button>
                            )}
                            
                            </div>
                            {errors.phone_number && <span className="error">{errors.phone_number}</span>}
                          </div>
                          
                          <div className="form-group">
                            <label className='upload-label'>Email:</label>
                            <input type="email" name="email" value={userData.email} onChange={handleChange} className='updatefill'/>
                            {errors.email && <span className="error">{errors.email}</span>}
                          </div>
                          <div className="form-group">
                            <label className='upload-label'>First Name:</label>
                            <input type="text" name="first_name" value={userData.first_name} onChange={handleChange} className='updatefill'/>
                          </div>
                          <div className="form-group">
                            <label className='upload-label'>Last Name:</label>
                            <input type="text" name="last_name" value={userData.last_name} onChange={handleChange} className='updatefill'/>
                          </div>
                          <div className="form-group">
                          <button type="submit" onClick={handleUpdateSubmit} className='update-btn'>Update</button>
                          </div>
                    </div>
                    <div className='image-update-cont' >
                          {!image && <h1>Profile Picture</h1>}
                       <div className='prof-img-sec'>
                          <label htmlFor="file-upload-input" className="custom-file-upload">
                            <FaEdit />
                          </label>
                          <input type="file" id='file-upload-input' onChange={(e) => setImage(e.target.files[0])}></input>
                          <img src={image ? URL.createObjectURL(image) : profile} alt="Uploaded" className="uploaded-image" />
                      </div>
                      {image &&
                       <div className='upload-remove'>
                        <button onClick={uploadImage} className='prof-butt' title='Update Profile Picture'><AiOutlineUpload /></button>
                        </div>
                     }
                     {!image &&
                     <button onClick={RemoveImage} className='prof-butt' title='Remove Profile Picture'><AiOutlineDelete /></button>
                      }
                    </div>
                </div>
            </div>
            <div className='prof-info-cont'>
            <h1 className='cont-head'>Change Password / <span style={{color:"red"}}>Delete</span> Account</h1>
            <div className='profile-view'>
                <button onClick={handleChangePassword} className='update-btn'>🔐 Change Password </button>
                <button className='Delete-btn' onClick={() => setShowDeleteModal(true)}><AiOutlineDelete /> Delete Account</button>
                <button className='Delete-btn bg-blue-700' onClick={handleLogout}>Sign Out ➡️</button>
            </div>
            </div>
        </div>
        {showDeleteModal && (
        <div className="modal-background">
          <div className="modal">
          <FaExclamationCircle className='fa-exclamation' />
            <h2 className='username'>Are you sure you want to delete your account ?</h2>
            <p className='del-msg'>This action cannot be undone. Deleting your account will permanently remove all of your data, including your profile information and any associated content.</p>
            <div className="button-group">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={handleDeleteConfirmation}>Confirm</button>
            </div>
          </div>
        </div>
      )}
       {is_verified === 'false' && 
               <div className="modal-background">
                <div className='prof-right'>
                    <VerifyOtp />
                </div>
                </div>
}
    </div>
    </div>
  )
}

export default Settings
