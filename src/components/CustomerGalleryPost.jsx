import React, { useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';

const BusinessDetailsComponent = ({ business_details, galary_endpoint }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);

  const handleTakePhoto = (dataUri) => {
    setSelectedImage(dataUri);
    setIsCameraOpen(false);
  };

  const handleSelectFromGallery = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
    setIsGalleryOpen(false);
  };

  const handleImageLoaded = (image) => {
    // Additional logic if needed when image is loaded
  };

  const handleCropComplete = (crop) => {
    if (selectedImage && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(selectedImage, crop);
      setCroppedImage(croppedImageUrl);
    }
  };

  const getCroppedImg = (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg');
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

  const handleUploadCroppedImage = async () => {
    if (!croppedImage) return;

    try {
      const imageUrl = await uploadImage(croppedImage);
      const response = await axios.post(galary_endpoint, { url: imageUrl });
      console.log('Image URL successfully posted:', response.data);
    } catch (error) {
      console.error('Error uploading and posting image URL:', error);
    }
  };

  return (
    <div>
      <h1>{business_details.business_name}</h1>
      <img src={business_details.business_profile} alt="Business Profile" />
      <p>{business_details.description}</p>
      <button onClick={() => setIsCameraOpen(true)}>Add gallery images</button>

      {isCameraOpen && (
        <Camera onTakePhoto={(dataUri) => handleTakePhoto(dataUri)} />
      )}

      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="galleryInput"
        onChange={handleSelectFromGallery}
      />
      <label htmlFor="galleryInput">
        <button onClick={() => setIsGalleryOpen(true)}>Select from gallery</button>
      </label>

      {selectedImage && (
        <ReactCrop
          src={selectedImage}
          crop={crop}
          onImageLoaded={handleImageLoaded}
          onComplete={handleCropComplete}
          onChange={(newCrop) => setCrop(newCrop)}
        />
      )}

      {croppedImage && (
        <div>
          <h3>Cropped Image Preview:</h3>
          <img src={croppedImage} alt="Cropped Image" />
          <button onClick={handleUploadCroppedImage}>Upload Cropped Image</button>
        </div>
      )}
    </div>
  );
};

export default BusinessDetailsComponent;
