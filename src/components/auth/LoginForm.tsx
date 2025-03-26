import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../services/api";
import { loginSuccess, loginFailure } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import Input from "../common/Input";
import Button from "../common/Button";
import { LoginCredentials } from "../../types/auth";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(credentials);
      dispatch(loginSuccess(user));
      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      toast.error("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Login
      </h2>
      <Input
        label="Username"
        value={credentials.username}
        onChange={handleChange}
        name="username"
        placeholder="Enter your username"
      />
      <Input
        label="Password"
        value={credentials.password}
        onChange={handleChange}
        name="password"
        type="password"
        placeholder="Enter your password"
      />
      <Button onClick={() => {}} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
