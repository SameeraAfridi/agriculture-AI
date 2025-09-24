import React, { useState } from "react";
import vector from "../assets/vector.svg";
import home from "../assets/home.png";
import user from "../assets/User.svg";
import alert from "../assets/alert.svg";
import { Link } from "react-router-dom";

function DiseaseDetection() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setResult(null); // clear old results
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please choose an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Something went wrong. Check backend.");
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
        <main className="flex justify-center items-center mt-6">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-white mb-4">
              Upload Crop Image
            </h2>

            {/* Preview */}
            {preview ? (
              <div className="relative mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-green-600"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-700 rounded-lg mb-4 border border-dashed border-green-600 text-gray-400 text-sm">
                No image uploaded
              </div>
            )}

            {/* Choose File */}
            <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Upload Button */}
            <button
              onClick={handleSubmit}
              disabled={!file}
              className={`ml-3 py-2 px-4 rounded-lg transition ${
                file
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Upload
            </button>

            {/* Result */}
            {result && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg text-white text-sm">
                <strong>Result:</strong> {JSON.stringify(result)}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer / Navbar */}
      {/* Footer / Navbar */}
 {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm border-t border-green-600/30">
  <nav className="flex justify-around items-center pt-2 pb-3">
    {/* Home */}
    <Link
      to="/"
      className="flex flex-col items-center justify-end gap-1 text-gray-400 cursor-pointer"
    >
      <img src={home} alt="Home" className="h-8 w-10 object-contain" />
      <p className="text-xs font-medium">Home</p>
    </Link>

    {/* Alerts */}
    <Link
      to="/alert"
      className="flex flex-col items-center justify-end gap-1 text-gray-400 cursor-pointer"
    >
      <img src={alert} alt="alert" className="h-8 w-10 object-contain" />
      <p className="text-xs font-medium">Alerts</p>
    </Link>

    {/* Profile */}
    <Link
      to="/profile"
      className="flex flex-col items-center justify-end gap-1 text-gray-400 cursor-pointer"
    >
      <img src={user} alt="Profile" className="h-8 w-10 object-contain" />
      <p className="text-xs font-medium">Profile</p>
    </Link>
  </nav>
</footer>

    </div>
  );
}

export default DiseaseDetection;
