import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineMic } from "react-icons/md";
import { CgMoreO } from "react-icons/cg";
import { AllProducts } from "../utils/data/abiSearchProfiles";
import { IoMdClose } from "react-icons/io";
import { data } from "../utils/data/abiSearchDummy";
import { FaStar } from "react-icons/fa6";
const AbiSearch = (props) => {
  const border = "border border-1 border-gray-500";
  const center = "flex justify-center items-center";
  const head ="topbar flex sticky top-0  bg-white h-[120px] items-center ";
  const searchBar = "flex md:text-[30px] text-[25px]  w-3/5"
  const inputRef = useRef(null);
  const inputDiv = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchInput,setSearchInput] = useState();
  const [filterData,setFilterData] = useState(data);
  function handleSearchClick() {
    inputRef.current.focus();
  }
  function handleInput(e){
    inputDiv.current.scrollIntoView(true, { behavior: "smooth" });
    setIsFocused(true);
    setSearchInput(e.target.value)
    const filter = data.filter(k=>{
      return k.business_name.toLowerCase().includes(e.target.value.toLowerCase())
    })
    
    setFilterData(filter);
    
    
  }
  function handleBlur() {
    if(!searchInput){
      setIsFocused(false);
    }
  }
  function handleClose(){
    setIsFocused(false);
    setSearchInput("");
  }
  return (
    <div>
      <h1 className="text-gray-500 text-center text-[40px] m-[20px]">
        ABI SEARCH
      </h1>
      <div
        ref={inputDiv}
        className={isFocused ? ` shadow-2xl ${head}` : `${head}`}
      >
        <div className={isFocused?`${searchBar} mx-[20px]`:`${searchBar} mx-auto`}>
          <div
            onClick={handleSearchClick}
            className={`${border} w-[60px] h-[60px] rounded-l-full border-r-0 ${center}`}
          >
            <IoSearchOutline className="text-gray-500"/>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for Categories"
            onInput={handleInput}
            value={searchInput}
            onBlur={handleBlur}
            className={
              border +
              " outline-none px-2 border-r-0 border-l-0 h-[60px] w-full"
            }
          />
          {
            isFocused?
            <div className="absolute w-full h-[80vh] bg-slate-100 top-[100px] right-0 flex justify-center overflow-y-auto">
            <div className="md:w-4/5 w-full">{
              filterData.map(k=>(
              <div className=" bg-slate-200 w-full h-[200px] md:h-[250px] my-5  rounded-xl flex items-center">
                <div className="w-[170px] h-[170px] md:h-[230px] md:w-[230px] mx-2">
                <img src={k.business_profile} className="w-[140px] h-[140px] md:h-[180px] md:w-[180px] rounded-lg " alt="" />
                <div className={k.rating >4 ? "bg-green-500 w-[120px] flex items-center justify-between px-3 m-1 rounded-lg" : "bg-red-500 w-[120px] flex items-center justify-between px-3 m-1 rounded-lg"}>{k.rating} <FaStar /></div>
                </div>
                <div className="w-full  md:h-[230px] h-[170px] flex flex-col justify-between">
                  <div className="">
                  <div className="name text-slate-600">{k.business_name}</div>
                    <p className="text-sm">{k.description.length >180 ?k.description.slice(0,180) +"...":k.description}</p>
                  </div>
                    
                    <div className="flex justify-center m-2 gap-2">
                      <button className="text-white w-[120px] text-sm py-2 bg-blue-600 px-1 rounded-lg ">Call Now</button>
                    
                      <button className="text-white w-[120px] text-sm py-2 bg-green-600 px-1  rounded-lg">Open Profile</button>
                    </div>
                </div>
              </div>))
            }</div>
            </div>:<></>
          }
          
          <div
            className={`${border} w-[60px] h-[60px] rounded-r-full border-l-0 ${center}`}
          >
            {
              isFocused?<IoMdClose onClick={handleClose} className="text-gray-500"/>:<MdOutlineMic className="text-gray-500" />
            }
            
          </div>
        </div>

        {isFocused ? <button className="bg-gray-200 w-[150px] h-[50px] rounded-l-full rounded-r-full">Location</button> : <></>}
      </div>

      <div
        className={
          " mt-[50px] mx-auto w-4/5 flex flex-wrap md:gap-10 gap-5 justify-center"
        }
      >
        {AllProducts.allProducts.map((k) => (
          <div key={k.name} className="cursor-pointer">
            <img src={k.image} className="md:w-[150px] md:h-[150px] w-[120px] h-[120px]" alt="" />
            <div className="text-lg md:w-[150px] w-[120px] font-bold text-center">
              {k.name}
            </div>
          </div>
        ))}
        <div className=" ">
          <div className="w-[150px] h-[150px] flex justify-center items-center">
            
             <CgMoreO className="text-[50px]" />
            
            
          </div>
          <div className="text-lg w-[150px] font-bold text-center">
            Load More...
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default AbiSearch;
