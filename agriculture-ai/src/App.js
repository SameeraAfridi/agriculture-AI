import React from "react";
import logo from "./logo.svg"; // Replace with your Agriculture AI logo
import "./App.css";

function App() {
  return (
    <div className="App min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header / Navbar */}
      <header className="w-full bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <img src={logo} alt="AgriAI Logo" className="w-10 h-10 mr-3" />
          <div>
            <h1 className="font-bold text-lg">Agriculture AI</h1>
            <p className="text-sm text-gray-200">Government Dashboard</p>
          </div>
        </div>
        <button className="text-white text-xl md:hidden">&#9776;</button> {/* Hamburger for mobile */}
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center mt-12 px-6 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="AgriAI Logo" className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Agriculture AI Dashboard</h2>
          <p className="text-gray-700 mb-6">
            Empowering agricultural decision-making with advanced artificial intelligence, 
            real-time monitoring, and predictive analytics for sustainable farming practices.
          </p>
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Government Certified System
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
