import React, { useState } from 'react';
import axios from 'axios';
import { FaEdit, FaPlus } from 'react-icons/fa';

function ImageCarouselCard({ carouselName, imageData, imageFieldName, postImageUrlEndpoint, patchImageUrlEndpoint, onUpload, business_id }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [bannerUpdateId, setBannerUpdateId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setBannerUpdateId(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    onUpload(carouselName, files); // Notify parent of selected images
  };

  const handleBannerDelete = async () => {
    try {
      await axios.delete(`${patchImageUrlEndpoint}/${bannerUpdateId}/`,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }
      );
      closePopup();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const uploadImage = async (image) => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "jvvslzla");
      data.append("cloud_name", "dybwn1q6h");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dybwn1q6h/image/upload",
        data
      );
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const postImageUrl = async (imageUrl) => {
    try {
      await axios.post(postImageUrlEndpoint, {
        [imageFieldName]: imageUrl,
        businessId: business_id,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
    } catch (error) {
      console.error("Error posting image URL:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      for (const image of selectedImages) {
        const imageUrl = await uploadImage(image);
        await postImageUrl(imageUrl);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
      window.location.reload();
    }
  };

  const handleFileUpload = async () => {
    try {
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("upload_preset", "jvvslzla");
      data.append("cloud_name", "dybwn1q6h");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dybwn1q6h/image/upload",
        data
      );
      const imageUrl = response.data.url;
      await axios.patch(`${patchImageUrlEndpoint}/${bannerUpdateId}/`, {
        [imageFieldName]: imageUrl,
        businessId: business_id,
      });
      closePopup();
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const clearSelectedImages = () => {
    setSelectedImages([]);
  };

  return (
    <div>
      <section className="mx-3 bg-white">
        <div className="flex flex-col">
          <h1 className="text-[18px] text-gray-500 font-bold">{carouselName}</h1>
          <div className="flex items-center mt-4 gap-2 overflow-x-auto">
            {imageData &&
              imageData.map((image, index) => (
                <img
                  key={index}
                  src={image[imageFieldName]}
                  alt={`Image ${index + 1}`}
                  className={`rounded-full w-16 h-16 sm:w-16 sm:h-16 border-[1px] border-blue-800 object-cover cursor-pointer ${
                    image.id === bannerUpdateId ? "border-2 border-blue-800" : ""
                  }`}
                  onClick={() => {setBannerUpdateId(image.id); setSelectedBanner(image[imageFieldName]); openPopup();}}
                />
              ))}
          </div>
        </div>
        <div className="">
          <div className="flex flex-col sm:items-start gap-4 sm:gap-10 my-4">
            <label htmlFor={`${carouselName}_fileInput`} className="w-20 flex items-center gap-2 cursor-pointer">
            {!selectedImages.length > 0 && (
              <div className='w-16 h-16 rounded-full shadow-lg border p-3 relative'>
                <img src="/image-gallery.png" alt="gallery" className='w-full h-auto object-cover'/>
              <div className='absolute right-[-10px] bottom-1 rounded-full p-[4px] border bg-white'>
              <FaPlus />
              </div>
              </div>
            )}
            </label>
            <input
              id={`${carouselName}_fileInput`}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {selectedImages.length > 0 && (
            <div className="flex items-center mt-4 gap-2 overflow-x-auto mb-4">
              {selectedImages.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Image ${index + 1}`}
                  className="rounded-full w-16 h-16 sm:w-16 sm:h-16 shadow-md object-cover"
                />
              ))}
            </div>
          )}
          {selectedImages.length > 0 && (
            <div className="flex gap-4 justify-center mb-4">
              <button
                className="text-white bg-red-500 text-lg hover:scale-110 rounded-xl px-4 py-2"
                onClick={handleUpload}
                disabled={uploading || selectedImages.length === 0}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
              <button
                className="text-red-500 border border-red-500 text-lg hover:scale-110 rounded-xl px-4 py-2"
                onClick={clearSelectedImages}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </section>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative bg-white p-4 sm:p-8 rounded-lg w-full sm:max-w-md mx-10">
            <div className="relative">
              <img
                src={selectedBanner}
                alt="Selected Image"
                className="rounded-lg mb-4 w-full h-auto object-cover"
                style={{ maxHeight: '300px' }}
              />
              <div
                className="absolute top-0 left-0 flex items-center justify-center cursor-pointer"
                onClick={() => document.getElementById('fileUpdateInput').click()}
              >
                <FaEdit className="w-10 h-10 text-gray-700 bg-white rounded-full p-2" />
              </div>
            </div>
            <input
              id="fileUpdateInput"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                  setSelectedBanner(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />
            <button
              onClick={handleFileUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mb-4"
            >
              Update Image
            </button>
            <button
              onClick={handleBannerDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg w-full mb-4"
            >
              Delete Image
            </button>
            <button onClick={closePopup} className="text-red-500 w-full">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageCarouselCard;
