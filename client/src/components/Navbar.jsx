import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the localStorage token
    localStorage.removeItem("token");
    navigate("/"); // Navigate to home page
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Logo or Brand */}
            <a
              href="/home"
              className="text-white text-2xl font-semibold hover:text-gray-200"
            >
              MyWebsite
            </a>
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <a
                href="/home"
                className="text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-700 hover:text-white"
              >
                Home
                </a>
            </div>
          </div>

          {/* Right Side with Logout Button */}
          <div className="flex items-center space-x-4">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-white px-4 py-2 rounded-md text-lg font-medium hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
