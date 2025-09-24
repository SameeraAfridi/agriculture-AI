import React from "react";
import vector from "../assets/vector.svg";
import home from "../assets/home.png";
import user from "../assets/User.svg";
import alertIcon from "../assets/alertIcon.svg";
import { Link } from "react-router-dom";

function FarmingTips() {
 const tips = [
  "Rotate crops each season to improve soil health.",
  "Use organic fertilizers to increase long-term productivity.",
  "Irrigate crops early in the morning to reduce water loss.",
  "Remove weeds regularly to prevent nutrient competition.",
  "Test your soil before planting to know the right nutrients needed.",
  "Adopt drip irrigation for efficient water usage.",
  "Store seeds in a cool, dry place to maintain their quality.",
  "Avoid over-fertilizing, as it can damage soil and groundwater.",
  "Use mulching to retain soil moisture and suppress weeds.",
  "Monitor weather forecasts before irrigation or pesticide spraying.",
  "Choose pest-resistant crop varieties when available.",
  "Use crop residue as compost to enrich the soil naturally.",
  "Plant cover crops to prevent soil erosion in off-seasons.",
  "Apply fertilizers based on soil test recommendations, not guesswork.",
  "Practice intercropping to reduce pests and increase productivity.",
  "Regularly maintain farm machinery to avoid downtime.",
  "Conserve rainwater using ponds or tanks for irrigation in dry seasons.",
  "Keep farm records (inputs, yields, costs) to track profitability.",
  "Train laborers on safe pesticide and equipment handling.",
  "Use smart sensors or drones (if available) to monitor crop health."
];


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

        {/* Tips Card */}
        <div className="flex justify-center items-center px-4">
          <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Farming Tips
            </h2>

            <ul className="space-y-3 list-disc list-inside text-sm text-gray-300">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
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

export default FarmingTips;
