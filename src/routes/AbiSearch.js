import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineMic } from "react-icons/md";
import { CgMoreO } from "react-icons/cg";
import { AllProducts } from "../utils/data/abiSearchProfiles";
const AbiSearch = (props) => {
  const border = "border border-1 border-gray-500";
  const center = "flex justify-center items-center";
  const head ="topbar flex sticky top-0  bg-white h-[180px] items-center ";
  const searchBar = "flex text-[30px] w-3/5"
  const inputRef = useRef(null);
  const inputDiv = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchInput,setSearchInput] = useState();
  function handleSearchClick() {
    inputRef.current.focus();
  }

  function handleInput(e){
    inputDiv.current.scrollIntoView(true, { behavior: "smooth" });
    setIsFocused(true);
    setSearchInput(e.target.value)
    
  }
  function handleBlur() {
    if(!searchInput){
      setIsFocused(false);
    }
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
        <div className={isFocused?`${searchBar} mx-[50px]`:`${searchBar} mx-auto`}>
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
            // onFocus={handleFocus}
            onBlur={handleBlur}
            className={
              border +
              " outline-none px-2 border-r-0 border-l-0 h-[60px] w-full"
            }
          />
          <div
            className={`${border} w-[60px] h-[60px] rounded-r-full border-l-0 ${center}`}
          >
            <MdOutlineMic className="text-gray-500" />
          </div>
        </div>

        {isFocused ? <button className="bg-gray-200 w-[150px] h-[50px] rounded-l-full rounded-r-full">Location</button> : <></>}
      </div>

      <div
        className={
          " mt-[50px] mx-auto w-4/5 flex flex-wrap gap-10 justify-center"
        }
      >
        {AllProducts.allProducts.map((k) => (
          <div key={k.name} className="cursor-pointer">
            <img src={k.image} className="w-[150px] h-[150px]" alt="" />
            <div className="text-lg w-[150px] font-bold text-center">
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
