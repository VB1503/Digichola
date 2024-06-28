import React, { useEffect, useState } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
import axios from "axios";
import { IoShareSocial } from 'react-icons/io5';
import { Check } from "lucide-react";
import Modal from 'react-modal';
import { Star as StarIcon, MessageCircle, MapPin, Heart } from "lucide-react";
import { IoLogoWhatsapp } from 'react-icons/io';
import { ChevronLeft,ChevronDown,ChevronUp } from "lucide-react";
import { FaRupeeSign } from 'react-icons/fa';
import { addRecentSearch } from '../components/localStorageUtil';
import Carousel from "../components/Carousel";
import ProfileViewSkeleton from "../components/BusinessProfileSkeleton";
const VideoThumbnail = ({ youtubeLink }) => {
    // Function to extract video ID from YouTube link
    const extractVideoId = (link) => {
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = link.match(regex);
      return match ? match[1] : null;
    };
  
    // Generate video ID from the provided YouTube link
    const videoId = extractVideoId(youtubeLink);
  
    return (
      <div className="w-full h-[280px] md:h-[360px] my-1 sm:my-4 flex flex-col mx-auto relative">
        {videoId && (
          <iframe
            title="YouTube Video Player"
            className="w-full h-full md:h-[300px] cursor-pointer rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            allowFullScreen
          />
        )}
      </div>
    );
  };
function ProfileView() {
  const [overviewData, setOverviewData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOverview, setSelectedOverview] = useState('');
  const [CarouselOpen, setCarouseelOpen] = useState(true)
  const [rated, setRated] = useState(false)
  const handleViewMore = (overview) => {
    setSelectedOverview(overview);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOverview('');
  };
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        section.scrollIntoView({ behavior: 'smooth' });
    };

    const navigate = useNavigate();
    const { page, category, business_id } = useParams();
    const [heartclick,setHeartclick] = useState(false)
    const [businessData, setBusinessData] = useState(null);
    const [bannerData, setBannerData] = useState(null);
    const [galaryData, setGalaryData] = useState(null);
    const [joinCommunityData, setJoinCommData] = useState('');
    const [LinkChainData, setLinkChainData] = useState('');
    const [CustomDescriptionData, setCustomDescriptionData] = useState('');
    const [BusinessUpdatePostersData, setBusinessUpdatePostersData] = useState('');
    const [DcCertificationData, setDcCertificationData] = useState('');
    const [rating, setRating] = useState(0);
    const [finalRating, setFinalRating] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const userId = parseInt(localStorage.getItem('userid'));
    const [carouselOpen, setCarouselOpen] = useState('');

  const openCarousel = (index,carouselType) => {
    setCarouselOpen(carouselType);
  };

  const closeCarousel = () => {
    setCarouselOpen('');
  };
  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.get(`https://digicholabackendfinal.onrender.com/api/v1/auth/vas_view_profile/${business_id}`);
            const response = res.data;
            setBusinessData(response.BusinessDetails[0]);
            setBannerData(response.BannerImages);
            setGalaryData(response.Galary);
            setJoinCommData(response.CreateCommunity);
            setBusinessUpdatePostersData(response.BusinessUpdatePosters);
            setCustomDescriptionData(response.CustomDescription);
            setLinkChainData(response.LinkChain);
            setDcCertificationData(response.DcCertification);
            setOverviewData(response.UpdatesOverview);

            // Add recent search with date and time
            addRecentSearch(response.BusinessDetails[0]);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    if (business_id) {
        fetchData();
    }
}, [business_id]);
const [qrData, setQrData] = useState({ qr_link: '', qr_image: '' });

useEffect(() => {
  const fetchQrData = async () => {
    try {
      const response = await axios.get(`https://digicholabackendfinal.onrender.com/api/v1/auth/qr_image_get/${business_id}/`);
      const data = response.data[0];
      setQrData({ qr_link: data.qr_link, qr_image: data.qr_image });
    } catch (error) {
      console.error('Error fetching QR data:', error);
    }
  };

  fetchQrData();
}, [business_id]);


const handleShareClick = async (business_name) => {
  try {
    const urlToShare = qrData.qr_link || window.location.href; // Use current page URL if qr_link is not available

    if (navigator.share) {
      await navigator.share({
        title: business_name,
        text: 'Check out this business',
        url: urlToShare,
      });
    } else {
      navigator.clipboard.writeText(urlToShare);
      alert('URL copied to clipboard');
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

    useEffect(() => {
        const interval = setInterval(() => {
            if (bannerData && bannerData.length > 0) {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1
                );
            }
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [bannerData]);
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleStarClick = (starIndex) => {
      setRating(starIndex + 1);
  };

  const handleRateNowClick = () => {
      const formData = {
          user: userId,
          business_id: parseInt(business_id),
          rating: parseInt(rating),
          comments:"sample rating"
      };
      console.log(formData)
      if (userId){
      // Post the rating to the endpoint
      axios.post('https://digicholabackendfinal.onrender.com/api/v1/auth/ratings/', formData)
          .then(response => {
              setRated(true);
              setTimeout(() => {
                setRated(false);
              }, 6000);
              console.log('Rating successfully posted:', response.data);
          })
          .catch(error => {
              console.error('Error posting rating:', error);
          })};
  };
  

  useEffect(() => {
      if (business_id && userId) {
      axios.get(`https://digicholabackendfinal.onrender.com/api/v1/auth/ratings/${userId}/${business_id}/`)
          .then(response => {
              setRating(response.data.Ratings);
              setFinalRating(response.data.Ratings);
          })
          .catch(error => {
              console.error('Error fetching rating:', error);
              setRating(0);
              setFinalRating(0);
          })};
  }, [userId, business_id]);

    const handleMapPinClick = () => {
        if (businessData && businessData.Location) {
            const [latitude, longitude] = businessData.Location.split(",");
            const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(mapsUrl, "_blank");
        }
    };

    const back = () => {
        if (page === "favourities") {
            navigate(`/favourities/`);
        }
        else if(page === "QR"){
          navigate('/');
        }
        else if(page === "home"){
          navigate('/');
        }
        else if(page === "Explore"){
          navigate('/Explore');
        }
         else {
            navigate(`/search/${category}`);
        }
    };

    
    const handleHeartClick = async () => {
        try {
            const userId = parseInt(localStorage.getItem('userid'));
            const favouriteData = {
                business_name: businessData.business_name,
                business_profile: businessData.business_profile ? businessData.business_profile : "https://cdn4.vectorstock.com/i/1000x1000/47/38/business-profile-icon-flat-design-vector-14544738.jpg",
                place: businessData.place,
                rating: businessData.rating,
                description: businessData.description,
                user: userId,
                category: category,
                business: parseInt(business_id)
            };
            const response = await axios.post('https://digicholabackendfinal.onrender.com/api/v1/auth/favourites/', favouriteData);
              alert("Added to Favourites")
              setHeartclick(true)
        } catch (error) {
            console.error('Error:', error);
            setHeartclick(true)
        }
    };

    if (!businessData) {
        return <ProfileViewSkeleton />;
    }
    const openWhatsAppProfile = (phoneNumber) => {
      // Construct the WhatsApp URL
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, '_blank');
    };

  return (
    <div>
        {/* header section */}
       <div className=" fixed z-10 w-full top-0 bg-white">
        <div className="flex items-center justify-between py-3 sm:py-5 ">
          <button onClick={back} className="ml-[18px]">
            <ChevronLeft className="sm:w-[50px] sm:h-[30px]" />
          </button>
          <div className="card-business-name text-center text-[20px] gap-2">{businessData.business_name}
          <img src="/verified.png" alt="verified" className="ml-1 w-[14px] h-[14px] inline"/>
          </div>

          <button onClick={()=>{handleShareClick(businessData.business_name)}} className="mr-[20px] p-[10px] shadow-lg rounded-lg">
            <IoShareSocial className="text-[18px] font-bold text-violet-700" />
          </button>
        </div>
    </div>
{/* body section */}
    <div className="mt-10 px-6 mb-20">
    <div className="pt-[50px]">
      
      <div className="relative sm:h-[300px] w-[310px] h-[140px] rounded-sm  sm:w-[500px] flex mx-auto bg-slate-400 border">
      {bannerData.map((banner, index) => (
        <img
          key={banner.id}
          src={banner.banner_image}
          alt={`Banner ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full rounded-sm transition-opacity object-cover ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute bottom-[-35px] w-full flex items-center justify-center">
      <div className=' w-[80px] h-[80px] bg-gray-200 rounded-full overflow-hidden shadow-lg'>
          <img src={businessData.business_profile ? businessData.business_profile : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg'} alt="Uploaded" className="object-cover w-full h-full" />
      </div>
    </div>
    </div>
    </div>
    <div className="flex items-center justify-center mt-[40px] flex-col">
    <div className="card-business-name text-[20px] text-center">{businessData.business_name}
         <span><img src="/verified.png" alt="verified" className="w-[14px] h-[14px] inline ml-1"/></span>
    </div>
    <div className="text-center text-[14px] md:text-[18px] md:w-[600px]">
        {businessData.description.length > 100 ? `${businessData.description.substring(0, 200)}...` : businessData.description} <span children className="text-blue-800 font-bold cursor-pointer text-[12px] md:text-[18px] hover:text-[14px]" onClick={() => handleViewMore(businessData.description)}>view more</span>
    </div>
    </div>
    <div className="flex  mt-6 items-center justify-center">
      
        <button
            className="call-btn text-[14px]"
            onClick={() => window.open(`tel:${businessData.business_phone_number}`)}
        >
        <img className="w-[20px] h-[20px] bg-white rounded-full" src="https://cdn-icons-png.flaticon.com/128/5585/5585856.png" alt="call" />  Call now 
        </button>
        <button onClick={() => openWhatsAppProfile(businessData.whatsapp_phone_number)} className="mx-3 sm:mx-10">
      <IoLogoWhatsapp className="text-green-500 hover:scale-110 sm:hover:scale-125 w-[40px] h-[30px] lg:w-[30px] lg:h-[30px]" />
       </button>
        <span className="mx-3 sm:mx-10" onClick={handleMapPinClick}>
            <MapPin className="text-red-500 hover:scale-110 sm:hover:scale-125 w-[40px] h-[30px] lg:w-[30px] lg:h-[30px]" />
        </span>
        <button className="mx-3 sm:mx-10" onClick={handleHeartClick}>
            <Heart className={`text-red-400 hover:scale-110 sm:hover:scale-125 w-[40px] h-[30px] lg:w-[30px] lg:h-[30px] ${heartclick ? "fill-current":""}`} />
        </button>
    </div>
    <div className="relative flex border bg-white border-gray items-center justify-center mx-auto w-[300px] my-6 p-1 sm:p-3 lg:p-4 sm:w-[600px] rounded-sm">
            {[...Array(5)].map((_, index) => (
                <StarIcon
                    key={index}
                    className={`mx-2 sm:mx-5 fill-current ${index < rating ? 'text-yellow-500' : 'text-gray-400'} cursor-pointer`}
                    onClick={() => handleStarClick(index)}
                />
            ))}
            <h1 className="text-gray-600 mx-1 sm:mx-3 lg:mx-4  cursor-pointer " onClick={handleRateNowClick}> {rated ? 'Rated' : 'Rate Now!'}</h1>
            {rated &&
            <img src="/start-spin.gif" alt="star" className="absolute right-4" />
            }
        </div>
        <section className="md:w-[90%] md:mx-auto">

      {BusinessUpdatePostersData[0] &&
      <div className=" my-[30px] sm:ml-[23px] ">
        
        <h1 className="font-bold sm:text-lg lg:text-2xl">Updates</h1>
        <div className="flex items-center mt-4 gap-2 overflow-x-auto scrollbar-hide md:justify-between">
        {BusinessUpdatePostersData &&
          BusinessUpdatePostersData.map((poster, index) => (
            <img
            key={index}
            src={poster.poster}
            alt={`Banner ${index + 1}`}
            className={'rounded-full w-[80px] h-[80px] border-[1px] border-blue-800 object-cover cursor-pointer md:w-[120px] md:h-[120px]'}
            onClick={() => openCarousel(index,"updates")}
            />
          ))}
          
      </div>
      </div>
        }
        {carouselOpen === "updates" && (
        <div>
          <Carousel images={BusinessUpdatePostersData} closeCarousel={closeCarousel} carouselName={"updates"} />
        </div>
          )}
        </section>
        
    <section className="flex w-full items-center justify-center mt-10">
          {joinCommunityData[0] &&
        <h1 className="p-[10px] shadow-sm border text-blue-700 rounded-lg cursor-pointer  text-[13px] sm:text-[16px] mx-2 sm:mx-6 lg:mx-8 lg:text-xl" onClick={() => scrollToSection('joinCommunity')}>
        Join community
        </h1>
        }
        {LinkChainData[0] &&
        <h1 className="p-[10px] shadow-sm border text-blue-700 rounded-lg cursor-pointer text-[13px] sm:text-[16px] mx-2 sm:mx-6 lg:mx-8 lg:text-xl" onClick={() => scrollToSection('linkChain')}>
        Link Chain
        </h1>
}
        {galaryData[0] &&
        <h1 className="p-[10px] shadow-sm border text-blue-700 rounded-lg cursor-pointer text-[13px] sm:text-[16px] mx-2 sm:mx-6 lg:mx-8 lg:text-xl" onClick={() => scrollToSection('gallery')}>
        Gallery
        </h1>
}
    </section>
    {overviewData[0] &&
    <section className="my-[30px]">
  <h1 className="font-bold sm:text-lg lg:text-2xl md:text-center">
    Overview
  </h1>
  <div className="flex flex-col md:flex-row md:flex-wrap gap-6 items-center w-full md:justify-evenly">
    {overviewData.map((overview, index) => (
      <div key={index} className="my-6 p-4 sm:p-4 lg:p-8 flex flex-col bg-white h-[360px] md:h-[560px] shadow-lg border rounded-2xl max-w-[500px] md:max-w-[680px]">
        <p className="text-gray-500 p-2 text-xs sm:text-sm lg:text-lg">
          {overview.overview.length > 100 ? `${overview.overview.substring(0, 200)}...` : overview.overview}
        </p>
        <VideoThumbnail youtubeLink={overview.youtube_link} />
        <div className="flex items-center mt-4 justify-between">
          <button className="flex gap-[3px] items-center py-[6px] font-bold text-xs sm:text-lg lg:text-xl hover:scale-105 sm:hover:scale-110 py-1 text-white bg-green-400 rounded-lg px-2 sm:px-3 lg:px-4">
            <FaRupeeSign /> send now
          </button>
          {overview && (
            <button className="text-blue-700 underline" onClick={() => handleViewMore(overview.overview)}>
              View More
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
  
  <Modal
    isOpen={showModal}
    onRequestClose={closeModal}
    contentLabel="Full Overview"
    className="modal-overview"
    overlayClassName="modal-overview-overlay"
  >
    <h2 className="text-2xl font-bold mb-4">Full Overview</h2>
    <p className="text-gray-500 mb-4">{selectedOverview}</p>
    <button onClick={closeModal} className="text-white bg-blue-500 px-4 py-2 rounded">
      Close
    </button>
  </Modal>
</section>
}
    <section className="my-[30px] md:w-[90%] md:mx-auto" id="gallery">
      {galaryData[0] && (
        <>
          <h1 className="font-bold sm:text-lg lg:text-2xl md:text-2xl">Gallery</h1>
          <div className="flex items-center mt-4 gap-2 overflow-x-auto scrollbar-hide md:gap-5">
            {galaryData.map((galary, index) => (
              <img
                key={index}
                src={galary.galary_photo}
                alt={`Banner ${index + 1}`}
                className="w-[100px] h-[140px] border-[1px] shadow-sm object-cover cursor-pointer rounded-xl md:w-[160px] md:h-[200px]"
                onClick={() => openCarousel(index,"gallery")}
              />
            ))}
          </div>
          {carouselOpen === "gallery" && (
            <div>
              <Carousel images={galaryData} closeCarousel={closeCarousel} carouselName={"gallery"} />
            </div>
          )}
        </>
      )}
    </section>
{joinCommunityData[0] &&

<section className="flex flex-col md:w-[90%] md:mx-auto" id="joinCommunity">
<h1 className="font-bold md:text-2xl">Join community</h1>
<div className="flex flex-col md:flex-row md:flex-wrap md:justify-evenly">
  {joinCommunityData.map((cont, index) => (
    <div key={cont.id} className="my-[20px] p-4 bg-white border rounded-2xl shadow-sm w-full sm:w-[500px] lg:w-[600px] h-auto">
      <div className="flex gap-3">
        <div className="h-[50px] flex w-[56px] sm:w-[75px] sm:h-[75px] lg:w-[100px] lg:h-[100px] bg-slate-400 rounded-lg">
          <img src={cont.community_profile} alt={cont.id} className="w-full h-full object-cover rounded-lg"/>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[18px] text-blue-900 lg:text-xl">
            {cont.community_name}
          </h1>
          <div className="flex items-center">
            <span className="mr-[4px] text-[4px]">
              <img src={cont.Social_icon} alt="media" className="w-[20px] h-[20px]"/>
            </span>
            <p className="text-gray-500 text-[12px] sm:text-[14px]">
              {cont.social_media_name}
            </p>
          </div>
        </div>
      </div>
      <div className="text-[14px] mt-2">
        <span className="text-blue-800 font-bold">Community Members: </span>{cont.community_member_count}
      </div>
      <p className="text-gray-500 text-xs lg:text-lg sm:text-lg text-justify py-3">
        {cont.community_description.length > 80 ? `${cont.community_description.substring(0, 200)}...` : cont.community_description}
      </p>
      <div className="flex justify-between w-full">
        <div className="flex gap-3">
          <button 
            className="text-green-600 border border-green-600 rounded-lg px-4 py-1 lg:px-8 hover:scale-110 hover:shadow-2xl"
            onClick={() => {
              if (cont.free_link) {
                window.open(cont.free_link, "_blank");
              } else {
                console.log("No free link available");
              }
            }}
          >
            Free
          </button>
          <button 
            className="neon-gradient-button text-white font-600 rounded-lg px-4 py-1 lg:px-8 hover:scale-110 hover:shadow-2xl"
            onClick={() => {
              if (cont.paid_link) {
                window.open(cont.paid_link, "_blank");
              } else {
                console.log("No paid link available");
              }
            }}
          >
            Join
          </button>
        </div>
        <button className="text-blue-700 underline" onClick={() => handleViewMore(cont.community_description)}>
          View More
        </button>
      </div>
    </div>
  ))}
</div>
</section>

}

{DcCertificationData[0] &&
<section className="md:w-[90%] md:mx-auto">
        <h1 className="sm:text-2xl lg:text-2xl font-bold">
          Digichola certification
        </h1>
        {DcCertificationData[0] &&
          <p className="text-center p-2 md:text-start"><span className="text-blue-800 text-[16px] italic">Verified date:</span> { DcCertificationData[0].issued_date}</p>
}
        <div className="flex flex-col items-center gap-[14px] md:flex-row md:justify-evenly">
          <div className="h-auto w-[289px] h-[140px] rounded-2xl">
            <img src={DcCertificationData[0].certificate} alt="certificate" className="w-full h-full object-contain"/>
          </div>
          <div>
          <p className="w-full text-[14px] leading-5 md:leading-10 text-center md:text-2xl ">
            This business profile is succesfully verified by <span className="text-blue-800 font-bold">Digichola Team</span>
          </p>
          </div>
        </div>
      </section>
}
{LinkChainData[0] &&
 <section className="my-[30px] md:w-[90%] mx-auto" id="linkChain">
 <h1 className="font-bold md:text-2xl">Link chain</h1>
 <div className="flex flex-col md:flex-row md:gap-2 flex-wrap">
   {LinkChainData.map(link => (
     <button 
       key={link.id} 
       className="border bg-white my-2 rounded-xl flex items-center p-2 shadow-sm hover:shadow-lg transition-all hover:scale-100"
       onClick={() => window.open(link.links, '_blank')}
     >
       <img src={link.link_icon} alt="icon" className="w-[20px] h-[20px] mr-[10px]" />
       {link.link_name}
     </button>
   ))}
 </div>
</section>

}
{CustomDescriptionData[0] &&
<div className="w-full md:w-[90%] md:mx-auto">
            <h2 className="text-lg font-bold mb-2 md:text-2xl">FAQ</h2>
            {CustomDescriptionData.map((data, index) => (
                <div key={index} className="border-b">
                    <button
                        onClick={() => toggleAccordion(index)}
                        className="flex justify-between w-full py-2  focus:outline-none"
                    >
                        <span className="text-[16px] text-left flex-grow md:text-[18px]">{index + 1}. {data.title}</span>
                        <div className="max-w-[50px] text-blue-700 ">
                        {activeIndex === index ? (
                            <ChevronUp className="" />
                        ) : (
                            <ChevronDown />
                        )}
                        </div>
                    </button>
                    {activeIndex === index && (
                        <p className="text-gray-500 mt-2 md:text-[16px]">{data.custom_description}</p>
                    )}
                </div>
            ))}
        </div>
}
    </div>
    </div>
  )
}

export default ProfileView
