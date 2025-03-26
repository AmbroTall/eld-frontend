import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar Toggle Button (Only on Mobile) */}
      <button
        className="md:hidden p-2 text-gray-800 dark:text-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <CloseIcon fontSize="large" />
        ) : (
          <MenuIcon fontSize="large" />
        )}
      </button>

      {/* Sidebar Content */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-100 dark:bg-gray-900 w-64 p-4 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:relative md:block`}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Menu
        </h2>
        <ul>
          <li className="mb-2">
            <Link
              to="/"
              className="block text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/trips"
              className="block text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              My Trips
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/create-trip"
              className="block text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Create Trip
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
