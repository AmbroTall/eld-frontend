import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import Navbar from "./components/layout/Navbar";
import ToastContainer from "./components/common/ToastContainer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TripCreate from "./pages/TripCreate";
import TripList from "./pages/TripList";
import TripLogs from "./pages/TripLogs";
import Sidebar from "./components/layout/Sidebar";

const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar (Only on small screens) */}
        <div className={`md:hidden ${isSidebarOpen ? "block" : "hidden"}`}>
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          {/* Navbar with toggle for sidebar */}
          <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-trip" element={<TripCreate />} />
              <Route path="/trips" element={<TripList />} />
              <Route path="/trips/:tripId/logs" element={<TripLogs />} />
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
