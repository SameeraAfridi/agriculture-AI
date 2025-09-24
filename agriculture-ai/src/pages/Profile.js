import React, { useState } from "react";
import vector from "../assets/vector.svg";
import home from "../assets/home.png";
import user from "../assets/User.svg";
import alert from "../assets/alert.svg";
import { Link } from "react-router-dom";

function Profile() {
  const [isSignIn, setIsSignIn] = useState(true);

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

        {/* Auth Card */}
        <div className="px-6 mt-6 flex justify-center">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-white mb-4 text-center">
              {isSignIn ? "Sign In" : "Sign Up"}
            </h2>

            <form className="space-y-4">
              {!isSignIn && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              {!isSignIn && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition duration-200"
              >
                {isSignIn ? "Sign In" : "Sign Up"}
              </button>
            </form>

            {/* Toggle between Sign In & Sign Up */}
            <p className="text-sm text-gray-400 text-center mt-4">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="text-green-400 hover:underline"
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
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
      to="/Profile"
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

export default Profile;
