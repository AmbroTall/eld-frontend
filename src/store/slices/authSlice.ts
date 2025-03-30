import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
  registerSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login reducers
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.loading = false;
    },

    // Register reducers
    registerStart(state) {
      state.loading = true;
      state.error = null;
      state.registerSuccess = false;
    },
    registerSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      state.registerSuccess = true;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.loading = false;
      state.registerSuccess = false;
    },

    // Common reducers
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      state.registerSuccess = false;
    },
    clearAuthError(state) {
      state.error = null;
    },
    resetRegisterSuccess(state) {
      state.registerSuccess = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearAuthError,
  resetRegisterSuccess,
} = authSlice.actions;

export default authSlice.reducer;
