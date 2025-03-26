import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Home: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Welcome to ELD App
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Manage your trips and logs with ease. Comply with HOS regulations
        effortlessly.
      </p>
      {isAuthenticated ? (
        <Link
          to="/create-trip"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create a New Trip
        </Link>
      ) : (
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login to Get Started
        </Link>
      )}
    </div>
  );
};

export default Home;
