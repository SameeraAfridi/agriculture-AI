import React from "react";
import vector from "../assets/vector.svg";
import bug from "../assets/bug.svg";
import weather from "../assets/weather.svg";
import yieldicon from "../assets/yieldicon.svg";
import tips from "../assets/tips.svg";
import home from "../assets/home.png";
import user from "../assets/User.svg";
import { Link } from "react-router-dom";


function Deshboard() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden bg-gray-900">
            <div className="flex-grow">
                {/* Header */}
                <header className="flex flex-col items-center p-4 pb-6 text-center">
                    <div className="mb-2">
                        <img
                            src={vector}
                            alt="Agri-AI Logo"
                            className="h-12 w-12 object-contain"
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-white">Agri-AI</h1>
                    <p className="text-sm text-white/70">Your smart farming assistant</p>
                </header>

                {/* Main cards */}
                <main className="flex-1 p-4">

                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/DiseaseDetection" style={{ textDecoration: "none" }}>
                            {/* Card 1 */}
                            <div className="flex flex-col items-center justify-center gap-4 rounded-xl p-4 bg-green-600/20 hover:bg-green-600/30 transition aspect-square cursor-pointer">
                                <img
                                    src={bug}
                                    alt="Detect Disease"
                            className="h-12 w-12 object-contain"
                        />
                            <p className="text-base font-semibold text-center text-white">Detect Disease</p>
                            </div>
                        </Link>

                        {/* Card 2 */}
                        <Link to="/WeatherForecast" style={{ textDecoration: "none" }}>
                            <div className="flex flex-col items-center justify-center gap-4 rounded-xl p-4 bg-green-600/20 hover:bg-green-600/30 transition aspect-square cursor-pointer">
                                <img
                                    src={weather}
                                    alt="Weather Forecast"
                                    className="h-12 w-12 object-contain"
                                />
                                <p className="text-base font-semibold text-center text-white">Weather Forecast</p>
                            </div>
                        </Link>

                        {/* Card 3 */}
                        <Link to="/YieldForecast" style={{ textDecoration: "none" }}>
                            <div className="flex flex-col items-center justify-center gap-4 rounded-xl p-4 bg-green-600/20 hover:bg-green-600/30 transition aspect-square cursor-pointer">
                                <img
                                    src={yieldicon}
                                    alt="Yield Forecast"
                                    className="h-12 w-12 object-contain"
                                />
                                <p className="text-base font-semibold text-center text-white">Yield Forecast</p>
                            </div>
                        </Link>

                        {/* Card 4 */}
                        <Link to="/farmingtips" style={{ textDecoration: "none" }}>
                            <div className="flex flex-col items-center justify-center gap-4 rounded-xl p-4 bg-green-600/20 hover:bg-green-600/30 transition aspect-square cursor-pointer">
                                <img
                                    src={tips}
                                    alt="Farming tips"
                                    className="h-12 w-12 object-contain"
                                />
                                <p className="text-base font-semibold text-center text-white">Farming Tips</p>
                            </div>
                        </Link>
                    </div>
                </main>
            </div>

            {/* Footer */}
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

export default Deshboard;
