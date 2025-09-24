import React from "react";
import vector from "../assets/vector.svg";
import home from "../assets/home.png";
import user from "../assets/User.svg";

function YieldForecast() {
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
      </div>

      {/* Footer / Navbar */}
      <footer className="sticky bottom-0 bg-gray-800/80 backdrop-blur-sm border-t border-green-600/30">
        <nav className="flex justify-around items-center pt-2 pb-3">
          <a className="flex flex-col items-center justify-end gap-1 text-green-400 cursor-pointer">
            <img
              src={home}
              alt="Home"
              className="h-8 w-10 object-contain"
            />
            <p className="text-xs font-medium">Home</p>
          </a>
          <a className="flex flex-col items-center justify-end gap-1 text-gray-400 cursor-pointer">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Z" />
            </svg>
            <p className="text-xs font-medium">Alerts</p>
          </a>
          <a className="flex flex-col items-center justify-end gap-1 text-gray-400 cursor-pointer">
            <img
              src={user}
              alt="Profile"
              className="h-8 w-10 object-contain"
            />
            <p className="text-xs font-medium">Profile</p>
          </a>
        </nav>
      </footer>
    </div>
  );
}

export default YieldForecast;
