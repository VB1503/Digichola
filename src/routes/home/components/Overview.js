import React from "react";
import Autoslider from "./Autoslider";
import Professionslider from "./Professionslider";
import list from "../images/Abisearch/categorized_listing.png";
import option from "../images/Abisearch/Comprehensive_option.png";
import time from "../images/Abisearch/time_efficiency.png";
import qr from "../images/Abisearch/quick_refe.png";
import quality from "../images/Abisearch/quality assurance.png";
import reviews from "../images/Abisearch/customer_reviews.png";
import com_resrc from "../images/Abisearch/community_resrc.png"
import map from "../images/Abisearch/map_integration.png";
import { useNavigate } from "react-router-dom";
import '../styles/Overview.css'

const Overview = () => {
  const services1 = [
    { title: "Categorized listings", image: list },
    { title: "Comprehensive Option", image: option },
    { title: "Time-Efficient Search", image: time },
    { title: "Quick reference", image: qr },
  ];
  const services2 = [
    { title: "Quality Assurance", image: quality},
    { title: "Customer reviews", image: reviews},
    { title: "Community resource", image: com_resrc },
    { title: "Map integration", image: map },
  ];

  const navigate = useNavigate();

  return (
    <div className="Overview">
      <h2 className="sec-heading">Overview</h2>
      <div className="Overview-content">
        <h2>ABI SEARCH</h2>
        <p className="Overview-main">
          search verified trusted
          <br /> Profession{" "}
        </p>
        <Professionslider />

        <Autoslider />
        <div className="services">
          <div className="services-list1">
            {services1.map((i) => (
              <div style={{ display: "flex",padding:8 }}>
                <img src={i.image} alt={i.title} className="list-style-img" />
                <span className="list-style-name">{i.title}</span>
              </div>
            ))}
          </div>
          <div className="services-list1">
            {services2.map((i) => (
              <div style={{ display: "flex",padding:8 }}>
                <img src={i.image} alt={i.title} className="list-style-img" />
                <span className="list-style-name">{i.title}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="quote">Your one-stop destination for seamless business exploration.</p>

        <div className="btns-primary">
          <button onClick={()=>navigate('/')} className="btn-primary">
                30 days free
          </button>
          <button onClick={()=>navigate('/abi')} className="btn-primary">
              Open Abi Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
