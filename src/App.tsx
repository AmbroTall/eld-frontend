import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ToastContainer from "./components/common/ToastContainer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TripCreate from "./pages/TripCreate";
import TripList from "./pages/TripList";
import TripLogs from "./pages/TripLogs";
import Register from "./pages/Register";
import DriverProfilePage from "./pages/DriverProfilePage";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-trip" element={<TripCreate />} />
        <Route path="/trips" element={<TripList />} />
        <Route path="/trips/:tripId/logs" element={<TripLogs />} />
        <Route path="/profile" element={<DriverProfilePage />} />
      </Routes>

      <ToastContainer />
    </Router>
  );
};

export default App;
