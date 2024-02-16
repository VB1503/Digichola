import { useState, useEffect, useRef } from "react";
import "./login.style.css";
import logo from "../images/logo.png";
import { FaEyeSlash, FaEye,FaFacebook,FaLinkedin } from "react-icons/fa";
import { IoCheckbox } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { TiSocialLinkedinCircular } from "react-icons/ti";
import { Link } from "react-router-dom";
export default function Login() {
    const email = useRef(null);
    const password = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [checked,setChecked] = useState(false);
  const [text,setText] = useState("");
    function formValidate(e){
        e.preventDefault()
    }
  return (
    <div className="cursor-default">
      <form onSubmit={formValidate}>
        <div className="w-[100%] min-h-[100vh] bg-[#6d9ac4] flex justify-center items-center">
          <div className=" bg-white w-[450px] h-[600px] m-auto rounded-lg shadow-2xl p-[30px]">
            <div className="flex justify-center items-center gap-2">
              <img src={logo} alt="" className="w-[50px] h-[50px] " />
              <div className="text-[40px] ">Digichola</div>
            </div>
            <div className="h-[20px] text-red-500 flex justify-center items-center">{text}</div>
            <div className="text-2xl py-2">Login</div>
            <div className=" flex flex-col m-2">
              <label htmlFor="mail" className="text-gray-600">
                Email
              </label>
              <input
              ref={email}
                type="text"
                name=""
                id="mail"
                className="outline-none border border-1 px-2 text-[20px] text-gray-700 border-gray-300 h-[40px] rounded-lg "
              />

            </div>
            <div className=" flex flex-col m-2">
              <label htmlFor="pass" className="text-gray-600">
                Password
              </label>
              <div className="flex w-full relative">
                <input
                ref={password}
                  type={showPassword ? "text" : "password"}
                  name=""
                  id="pass"
                  className="outline-none px-2 border border-1 text-[20px] text-gray-700 border-gray-300 h-[40px] rounded-lg w-full"
                />
                {showPassword ? (
                  <FaEyeSlash
                    className="absolute right-1 top-3 w-[20px] h-[20px]"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <FaEye
                    className="absolute right-1 top-3 w-[20px] h-[20px]"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
              </div>
                    <div className="">
              <div  className=" mt-4 flex items-center gap-2 w-[200px]">
                <div  onClick={()=>setChecked(!checked)}>
                  <div  className="w-[30px] h-[30px] border border-1 border-gray-400 rounded-md">
                  <IoCheckbox className={checked?" hidden w-full h-full ":"w-full h-full text-[#ee5784] "}/>
                  </div>
                </div>
                <div onClick={()=>setChecked(!checked)} className="text-gray-700">Remember me?</div>
              </div>

            </div>
            
            <button className="bg-[#ee5784] mt-2 h-[40px] rounded-lg text-white shadow-lg w-full">LOGIN</button>
              <div className="text-gray-700 flex justify-end cursor-pointer">Forgot Password?</div>

            <div className="flex mt-2 justify-center items-center">
                <hr className="w-[120px]"/>
                <div className="border border-1 border-gray-300 text-gray-500 text-lg flex justify-center items-center w-[30px] h-[30px]">or</div>
                <hr className="w-[120px]"/>
            </div>

            <div className=" m-5 flex justify-evenly">
            <FcGoogle className="w-[40px] h-[40px]"/>
             <FaFacebook className="w-[40px] h-[40px] text-blue-400"/>   
             <FaLinkedin className="w-[40px] h-[40px] text-blue-600 " />
            </div>


            <div className="flex justify-center">Need an Account? &nbsp;<Link to={"/register"} className="underline text-[#ee5784]">SIGN UP</Link></div>
          </div>
        </div>
      </form>
    </div>
  );
}
