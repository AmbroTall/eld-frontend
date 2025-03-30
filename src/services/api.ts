import axios from "axios";
import { LoginCredentials, RegisterCredentials, User } from "../types/auth";
import { DailyLog } from "../types/log";
import { TripInput, Trip, PaginatedResponse } from "../types/trip";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";

const API_URL = "https://eld-backend-61qy.vercel.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Dispatch logout action to update the store
      store.dispatch(logout());

      // Clear localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      window.location.href = "/login";

      // Return a rejected promise to stop further processing
      return Promise.reject(error);
    }

    // For other errors, reject the promise and let the caller handle it
    return Promise.reject(error);
  }
);

export default api;

export const register = async (credentials: RegisterCredentials) => {
  const { password, ...rest } = credentials; // Deconstruct password and rest of the fields
  const payload = {
    ...rest, // Spread the remaining fields
    password1: password, // Map password to password1
    password2: password || password, // Use password2 if provided, otherwise fallback to password
  };
  const response = await api.post("/auth/register/", payload);
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

// export const fetchTrips = async (): Promise<Trip[]> => {
//   const response = await api.get("/trips/");
//   return response.data;
// };

export const fetchTrips = async (
  page: number = 1
): Promise<PaginatedResponse<Trip>> => {
  try {
    const response = await api.get<PaginatedResponse<Trip>>(
      `/trips/?page=${page}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch trips");
  }
};

export const fetchTripLogs = async (tripId: number): Promise<DailyLog[]> => {
  const response = await api.get(`/trips/${tripId}/logs/`);
  return response.data;
};

export const createTripLog = async (
  tripId: number,
  data: Omit<DailyLog, "id"> // Data to send, excluding the id field
): Promise<DailyLog> => {
  const url = `/trips/${tripId}/logs/`;
  const response = await api.post(url, data);
  return response.data; // Expecting a single DailyLog object
};

export const fetchProfile = async () => {
  try {
    const response = await api.get(`/driver-profile/`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteTripLog = async (tripId: number, logId: number) => {
  await api.delete(`/trips/${tripId}/logs/${logId}/`);
};

export const updateProfile = async (data: {
  license_number: string;
  truck_number: string;
  carrier_name: string;
  main_office_address: string;
  home_terminal_address: string;
}) => {
  try {
    const response = await api.patch(`/driver-profile/update_profile/`, {
      data,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
