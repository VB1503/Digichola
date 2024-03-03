import React from "react";
import Marquee from "react-fast-marquee";
import nat1 from "../images/Autoslider/nat1.jpg";
import nat2 from "../images/Autoslider/nat 2.jpg";
import nat3 from "../images/Autoslider/nat 3.jpg";
import '../styles/Autoslider.css'
const Autoslider = () => {
  return (
    <div>
      <Marquee pauseOnHover>
        <div className="image-wrapper">
         
          <img src={nat1} alt="nat1" />
        </div >
        <div className="image-wrapper">
          <img src={nat2} alt="nat2" />
        </div>
        <div className="image-wrapper">
          <img src={nat3} alt="nat3" />
        </div>
      </Marquee>
    </div>
  );
};

export default Autoslider;
