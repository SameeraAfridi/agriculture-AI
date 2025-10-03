import React, { useState } from "react";
import vector from "../assets/vector.svg";
import home from "../assets/home.png";
import user from "../assets/User.svg";
import alertIcon from "../assets/alertIcon.svg";
import { Link } from "react-router-dom";

function WeatherForecast() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/weather?city=${city}`);
      if (!response.ok) throw new Error("Failed to fetch weather");

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
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

        {/* Weather Card */}
        <main className="flex justify-center items-center mt-6">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-white mb-4">
              Weather Forecast
            </h2>

            {/* City Input */}
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Get Weather Button */}
            <button
              onClick={getWeather}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
            >
              Get Weather Updates
            </button>

            {/* Result */}
            {weather && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg text-white text-sm text-left">
                <p><strong>City:</strong> {weather.city || city}</p>
                <p><strong>Temperature:</strong> {weather.temperature}°C</p>
                <p><strong>Condition:</strong> {weather.condition}</p>
                <p><strong>Humidity:</strong> {weather.humidity}%</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer / Navbar */}
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
      to="/Notification"
      className="flex flex-col items-center justify-end gap-1 text-gray-400 cursor-pointer"
    >
      <img src={alertIcon} alt="alertIcon" className="h-8 w-10 object-contain" />
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

export default WeatherForecast;
