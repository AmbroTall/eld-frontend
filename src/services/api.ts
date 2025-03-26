import axios from "axios";
import { TripInput, Trip, DailyLog } from "../types/trip";
import { LoginCredentials, User } from "../types/auth";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Tombotaller", token);
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    console.log("Request config:", config); // This will log the request configuration, including headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = async (
  username: string,
  password: string,
  email: string
) => {
  const response = await api.post("/auth/register/", {
    username,
    password,
    email,
  });
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post("auth/login/", credentials);
  const user = response.data;
  localStorage.setItem("token", user.key);
  return user;
};

export const createTrip = async (tripData: TripInput): Promise<Trip> => {
  const response = await api.post("/trips/", tripData);
  return response.data;
};

export const fetchTrips = async (): Promise<Trip[]> => {
  const response = await api.get("/trips/");
  return response.data;
};

export const fetchTripLogs = async (tripId: number): Promise<DailyLog[]> => {
  const response = await api.get(`/trips/${tripId}/logs/`);
  return response.data;
};
