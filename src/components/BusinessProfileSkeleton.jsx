import React from "react";
import { ChevronLeft } from "lucide-react";
import { IoShareSocial } from "react-icons/io5";
import { Star as StarIcon, MapPin, Heart } from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io";

const ProfileViewSkeleton = () => {
  return (
    <div>
      {/* Header section */}
      <div className="fixed z-10 w-full top-0 bg-white">
        <div className="flex items-center justify-between py-3 sm:py-5">
          <button className="ml-[18px]">
            <ChevronLeft className="sm:w-[50px] sm:h-[30px]" />
          </button>
          <div className="card-business-name text-center text-[20px] gap-2">
            <div className="bg-gray-300 w-[120px] h-[20px] mx-auto rounded"></div>
          </div>
          <button className="mr-[20px] p-[10px] shadow-lg rounded-lg">
            <IoShareSocial className="text-[18px] font-bold text-violet-700" />
          </button>
        </div>
      </div>

      {/* Body section */}
      <div className="mt-10 px-6 mb-20">
        <div className="pt-[50px]">
          <div className="relative sm:h-[300px] w-[310px] h-[140px] rounded-sm sm:w-[500px] flex mx-auto bg-gray-300"></div>
          <div className="absolute bottom-[-35px] w-full flex items-center justify-center">
            <div className="w-[80px] h-[80px] bg-gray-200 rounded-full overflow-hidden shadow-lg"></div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-[40px] flex-col">
          <div className="card-business-name text-[20px] text-center bg-gray-300 w-[150px] h-[20px] rounded"></div>
          <div className="text-center text-[14px] md:text-[18px] md:w-[600px] bg-gray-300 h-[50px] rounded my-2"></div>
        </div>

        <div className="flex justify-between mt-6 items-center">
          <button className="call-btn text-[14px] bg-gray-300 w-[100px] h-[40px] rounded"></button>
          <button>
            <IoLogoWhatsapp className="text-green-500 shadow-lg rounded-lg text-[26px] font-bold" />
          </button>
          <span className="mx-3 sm:mx-10">
            <MapPin className="text-red-500 hover:scale-110 sm:hover:scale-125 sm:w-[40px] sm:h-[30px] lg:w-[50px] lg:h-[40px]" />
          </span>
          <button className="mx-3 sm:mx-10">
            <Heart className="text-red-400 fill-current hover:scale-110 sm:hover:scale-125 sm:w-[40px] sm:h-[30px] lg:w-[50px] lg:h-[40px]" />
          </button>
        </div>

        <div className="flex border bg-white border-gray items-center justify-center mx-auto w-[300px] my-6 p-1 sm:p-3 lg:p-4 sm:w-[600px] rounded-sm">
          {[...Array(5)].map((_, index) => (
            <StarIcon key={index} className="mx-2 sm:mx-5 fill-current text-gray-300 cursor-pointer" />
          ))}
          <h1 className="text-gray-300 mx-1 sm:mx-3 lg:mx-4 cursor-pointer w-[60px] h-[20px] rounded"></h1>
        </div>

        <section>
          <div className="my-[30px] sm:ml-[23px]">
            <h1 className="font-bold sm:text-lg lg:text-xl bg-gray-300 w-[80px] h-[20px] rounded"></h1>
            <div className="flex items-center mt-4 gap-2 overflow-x-auto scrollbar-hide">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="rounded-full w-[80px] h-[80px] bg-gray-300"></div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center mt-10">
          {[...Array(3)].map((_, index) => (
            <h1 key={index} className="p-[10px] shadow-sm border bg-gray-300 text-gray-300 rounded-lg cursor-pointer text-[13px] sm:text-[16px] mx-2 sm:mx-6 lg:mx-8 w-[100px] h-[30px]"></h1>
          ))}
        </section>

        <section className="my-[30px]">
          <h1 className="font-bold sm:text-lg lg:text-xl bg-gray-300 w-[80px] h-[20px] rounded"></h1>
          <div className="flex gap-0 md:gap-6 items-center w-full flex-col md:flex-row md:justify-evenly">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="my-6 p-4 sm:p-4 lg:p-8 flex flex-col bg-gray-200 h-[360px] md:h-[560px] shadow-lg border rounded-2xl max-w-[500px] md:max-w-[680px]">
                <p className="text-gray-400 p-2 text-xs sm:text-sm lg:text-lg bg-gray-300 h-[80px] rounded"></p>
                <div className="bg-gray-300 w-full h-[280px] md:h-[360px] rounded-lg"></div>
                <div className="flex items-center mt-4 justify-between">
                  <button className="flex gap-[3px] items-center py-[6px] font-bold text-xs sm:text-lg lg:text-xl hover:scale-105 sm:hover:scale-110 py-1 text-white bg-gray-300 rounded-lg px-2 sm:px-3 lg:px-4 w-[80px] h-[30px]"></button>
                  <button className="text-blue-300 underline w-[80px] h-[20px] rounded"></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="my-[30px]" id="gallery">
          <h1 className="font-bold sm:text-lg lg:text-xl bg-gray-300 w-[80px] h-[20px] rounded"></h1>
          <div className="flex items-center mt-4 gap-2 overflow-x-auto scrollbar-hide">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="w-[100px] h-[140px] bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </section>

        <section className="flex flex-col" id="joinCommunity">
          <h1 className="font-bold bg-gray-300 w-[100px] h-[20px] rounded"></h1>
          <div className="flex flex-col">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="my-[20px] p-4 bg-gray-200 border rounded-2xl shadow-sm w-full sm:w-[500px] lg:w-[600px] h-auto">
                <div className="flex gap-3">
                  <div className="h-[50px] flex w-[56px] sm:w-[75px] sm:h-[75px] lg:w-[100px] lg:h-[100px] bg-gray-300 rounded-lg"></div>
                  <div className="flex flex-col">
                    <h1 className="text-[18px] text-blue-900 lg:text-xl bg-gray-300 w-[120px] h-[20px] rounded"></h1>
                    <div className="flex items-center bg-gray-300 w-[60px] h-[20px] rounded"></div>
                  </div>
                </div>
                <div className="text-[14px] mt-2 bg-gray-300 w-[150px] h-[20px] rounded"></div>
                <p className="text-gray-500 text-xs lg:text-xl sm:text-lg text-justify py-3 bg-gray-300 h-[80px] rounded"></p>
                <div className="flex justify-between w-full">
                  <div className="flex gap-3">
                    <button className="text-green-600 border border-green-600 rounded-lg px-4 py-1 lg:px-8 bg-gray-300 w-[60px] h-[30px]"></button>
                    <button className="text-red-600 border border-red-600 rounded-lg px-4 py-1 lg:px-8 bg-gray-300 w-[60px] h-[30px]"></button>
                  </div>
                  <div className="text-gray-500 flex flex-col items-end bg-gray-300 w-[60px] h-[20px] rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="w-full text-center py-3 sm:py-5 bg-white shadow-inner fixed bottom-0">
        <div className="container mx-auto flex justify-between items-center">
          <button className="flex flex-col items-center text-[14px] bg-gray-300 w-[60px] h-[40px] rounded"></button>
          <button className="flex flex-col items-center text-[14px] bg-gray-300 w-[60px] h-[40px] rounded"></button>
          <button className="flex flex-col items-center text-[14px] bg-gray-300 w-[60px] h-[40px] rounded"></button>
        </div>
      </footer>
    </div>
  );
};

export default ProfileViewSkeleton;
