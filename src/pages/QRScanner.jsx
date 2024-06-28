import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import QrScanner from "qr-scanner";
import QrFrame from "/qr-frame.png";

const QrReader = () => {
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [scannedResult, setScannedResult] = useState(undefined);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const [galleryOpt, setGalleryOpt] = useState(false);

  const onScanSuccess = (result) => {
    console.log(result);
    setScannedResult(result?.data);
    if (result?.data) {
      window.location.href = result.data;
    }
  };

  const onScanFail = (err) => {
    console.log(err);
  };
  useEffect(() => {
    const updateDimensions = () => {
      const height = window.innerHeight * 1; // 86% of the screen height
      document.documentElement.style.setProperty("--qr-reader-height", `${height}px`);
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl.current) {
        scanner.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn) {
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
    }
  }, [qrOn]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        console.log(selectedImage)
        QrScanner.scanImage(reader.result)
          .then((result) => {
            console.log(result);
            if (result) {
              setScannedResult(result);
            } else {
              setError("No QR code found in the selected image.");
            }
          })
          .catch((error) => {
            setError("Error scanning image.");
            console.error("Error scanning image:", error);
          });
      };
      reader.onerror = (error) => {
        setError("Error loading image file.");
        console.error("Error loading image file:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    window.location.href = "/";
  };

  const handleOpenUrl = () => {
    if (scannedResult) {
      window.location.href = scannedResult;
    }
  };
  const handleGotoScan = () =>{
    window.location.reload();
  }

  return (
    <div className="qr-reader">
       {!galleryOpt && (
          <div className="overlay"></div>
       )} 
     <style>
        {`.qr-reader {
          height: var(--qr-reader-height, 100vh);
        }`}
      </style>
      {!galleryOpt && (
        <>
          <video ref={videoEl}></video>
          <div ref={qrBoxEl} className="relative qr-box z-[1000]">
            <img
              src={QrFrame}
              alt="Qr Frame"
              width={256}
              height={256}
              className="qr-frame"
            />
            <div className="square"></div>
          </div>
          <FaTimes
            className="absolute top-5 right-5 text-white cursor-pointer text-[24px] z-[1000]"
            onClick={handleClose}
          />
          {scannedResult && !selectedImage && (
            <p className="result-url z-[1000]">{scannedResult}</p>
          )}
          <div className="absolute bottom-24 w-full z-[10000] ">
            <img
              src="/qr-gif-1.gif"
              alt="QR Scanner"
              className="w-[40px] h-[40px] object-cover mx-auto "
            />
          </div>
        </>
      )}
      {!selectedImage && (
      <div className="w-full flex items-center justify-center py-4 gap-2 absolute bottom-36">
        <button
          className="z-[1000] bg-white text-blue-800 text-[12px] font-bold px-4 py-[4px] shadow-md rounded-3xl border"
          onClick={() => {
            document.getElementById("fileInput").click();
            setGalleryOpt(true);
            scanner.current.stop()
          }}
        >
          <img src="/image-gallery.png" alt="image" className="inline w-[32px] h-[32px] p-2"/>
          Select from Gallery
        </button>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      )}
      {selectedImage && (
        <>
        <FaTimes
            className="absolute top-5 right-5 text-black cursor-pointer text-[24px]"
            onClick={handleClose}
          />
        <div className="w-full flex items-center justify-center py-4">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-[256px] h-[256px] object-cover"
          />
        </div>
        <div className="w-full flex items-center justify-center gap-2">
        <button
          className="bg-white text-blue-800 font-bold px-4 py-1 shadow-md rounded-3xl border"
          onClick={() => {
            document.getElementById("fileInput").click();
            setGalleryOpt(true);
            scanner.current.stop()
          }}
        >
          <img src="/image-gallery.png" alt="image" className="inline w-[40px] h-[40px] p-2"/>
          Choose Another
        </button>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button className="bg-white text-blue-800 font-bold px-4 py-2 shadow-md rounded-3xl border" onClick={handleGotoScan}><img src="/scan.png" alt="QR" className="w-[24px] h-[24px] inline"/> Scan</button>
      </div>
      </>
      )}
      {scannedResult && selectedImage && (
        <div className="w-full flex flex-col items-center justify-center gap-6 mt-4">
          <p className="text-[12px] w-[90%] text-center text-violet-color">{scannedResult}</p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleOpenUrl}
          >
            Open
          </button>
        </div>
      )}
      {error && (
        <div className="w-full flex items-center justify-center py-4 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default QrReader;
