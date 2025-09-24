import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Deshboard from "./pages/Deshbaoard.js"; // adjust path
import DiseaseDetection from "./pages/DiseaseDetection.js"; // adjust path
import YieldForecast from "./pages/YieldForecast.js"; // adjust path
import WeatherForecast from "./pages/WeatherForecast.js"; // adjust path
import FarmingTips from "./pages/FarmingTips.js"; // adjust path
import Alert from "./pages/alert.js"; // adjust path
import Profile from "./pages/Profile.js"; // adjust path
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Deshboard />} />

        {/* Disease Detection */}
        <Route path="/DiseaseDetection" element={<DiseaseDetection />} />

        {/* Yield Forecast */}
        <Route path="/YieldForecast" element={<YieldForecast />} />

        {/* Weather Forecast */}
        <Route path="/WeatherForecast" element={<WeatherForecast />} />

        {/* Farming Tips */}
        <Route path="/FarmingTips" element={<FarmingTips />} />

        {/* {Alert} */}
        <Route path="/alert" element={<Alert />} />

        {/* {Profile} */}
        <Route path="/Profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}

export default App;
