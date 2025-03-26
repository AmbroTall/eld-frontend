import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";
import Button from "../common/Button";

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
  };

  if (!isAuthenticated) return null;

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
