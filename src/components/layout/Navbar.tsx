import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ThemeToggle from "../common/ThemeToggle";
import LogoutButton from "../auth/LogoutButton";

interface SidebarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<SidebarProps> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-600 dark:bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Brand */}
          <Link to="/" className="text-white text-2xl font-bold">
            ELD App
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/trips" className="text-white hover:text-gray-200">
              Trips
            </Link>
            <Link to="/create-trip" className="text-white hover:text-gray-200">
              Create Trip
            </Link>
            <ThemeToggle />
            <LogoutButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon fontSize="large" />
          </button>
        </div>
      </nav>

      {/* Overlay (Click to Close Sidebar) */}
      <div
        className={`fixed inset-0 backdrop-blur-md z-40 transition-opacity ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsSidebarOpen(false)}
      >
        {/* Sidebar (Not Full-Screen) */}
        <div
          className={`fixed right-0 top-0 h-full w-3/4 max-w-xs bg-gray-100 dark:bg-gray-900 p-5 shadow-lg rounded-l-lg transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* Close Button (Styled & Positioned Better) */}
          <button
            className="absolute top-3 right-3 p-2 bg-gray-700 dark:bg-gray-600 text-white rounded-full hover:bg-gray-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <CloseIcon fontSize="medium" />
          </button>

          {/* Sidebar Content */}
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Menu
          </h2>
          <ul>
            <li className="mb-3">
              <Link
                to="/trips"
                className="block p-2 text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => setIsSidebarOpen(false)}
              >
                My Trips
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/create-trip"
                className="block p-2 text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => setIsSidebarOpen(false)}
              >
                Create Trip
              </Link>
            </li>
            <li className="mb-3">
              <ThemeToggle />
            </li>
            <li className="mb-3">
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
