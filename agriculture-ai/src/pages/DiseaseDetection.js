import React, { useState } from "react";
import vector from "../assets/vector.svg";
import home from "../assets/home.png";
import user from "../assets/User.svg";

function DiseaseDetection() {
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setPreview(null);
  };

  const handleSubmit = () => {
    if (preview) {
      alert("Image uploaded successfully 🚀");
      // Later connect to backend here
    } else {
      alert("Please choose an image first!");
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden bg-gray-900">
      <div className="flex-grow">
        {/* Header */}
        <header className="flex flex-col items-center p-6 text-center">
          <img
            src={vector}
            alt="Agri-AI Logo"
            className="h-14 w-14 object-contain mb-2"
          />
          <h1 className="text-2xl font-bold text-white">Agri-AI</h1>
          <p className="text-sm text-white/70">Your smart farming assistant</p>
        </header>

        {/* Upload Card */}
        <main className="flex justify-center items-center p-6">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg w-80 text-center relative">
            <h2 className="text-lg font-semibold text-white mb-4">
              Upload Crop Image
            </h2>

            {/* Image Preview OR Placeholder */}
            {preview ? (
              <div className="relative mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-green-600"
                />
                {/* Remove Button */}
                <button
                  onClick={handleRemove}
                  className="absolute top-1 right-1 hover:bg-red-700 text-white rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-full h-28 flex items-center justify-center bg-gray-700 rounded-lg mb-4 border border-dashed border-green-600 text-gray-400 text-sm">
                No image uploaded
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
              >
                Upload
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer / Navbar */}
      <footer className="sticky bottom-0 bg-gray-800/80 backdrop-blur-sm border-t border-green-600/30">
        <nav className="flex justify-around items-center pt-2 pb-3">
          <a className="flex flex-col items-center justify-end gap-1 text-green-400 cursor-pointer">
            <img src={home} alt="Home" className="h-8 w-10 object-contain" />
            <p className="text-xs font-medium">Home</p>
          </a>
          <a className="flex flex-col items-center justify-end gap-1 text-gray-400 cursor-pointer">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Z" />
            </svg>
            <p className="text-xs font-medium">Alerts</p>
          </a>
          <a className="flex flex-col items-center justify-end gap-1 text-gray-400 cursor-pointer">
            <img src={user} alt="Profile" className="h-8 w-10 object-contain" />
            <p className="text-xs font-medium">Profile</p>
          </a>
        </nav>
      </footer>
    </div>
  );
}

export default DiseaseDetection;
