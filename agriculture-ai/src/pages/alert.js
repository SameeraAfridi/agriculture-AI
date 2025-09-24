import React from "react";
import vector from "../assets/vector.svg";
import home from "../assets/home.png";
import user from "../assets/User.svg";
import alert from "../assets/alert.svg";

import { Link } from "react-router-dom";

function Alert() {
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

        {/* Notification Card */}
        <div className="px-6 mt-6">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-3">
              Notifications
            </h2>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="border-b border-gray-700 pb-2">
                New farming tip available in the Farming Tips section.
              </li>
              <li className="border-b border-gray-700 pb-2">
                Weather forecast shows high temperatures tomorrow. 
              </li>
              <li>
                Soil nitrogen levels updated for your last field test.
              </li>
            </ul>
          </div>
        </div>
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
            to="/alert"
            className="flex flex-col items-center justify-end gap-1 text-green-400 cursor-pointer"
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

export default Alert;
