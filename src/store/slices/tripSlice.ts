import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Trip, DailyLog } from "../../types/trip";

interface TripState {
  trips: Trip[];
  logs: DailyLog[];
  error: string | null;
  loading: boolean;
}

const initialState: TripState = {
  trips: [],
  logs: [],
  error: null,
  loading: false,
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    fetchTripsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTripsSuccess(state, action: PayloadAction<Trip[]>) {
      state.trips = action.payload;
      state.loading = false;
    },
    fetchTripsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    fetchLogsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLogsSuccess(state, action: PayloadAction<DailyLog[]>) {
      state.logs = action.payload;
      state.loading = false;
    },
    fetchLogsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchTripsStart,
  fetchTripsSuccess,
  fetchTripsFailure,
  fetchLogsStart,
  fetchLogsSuccess,
  fetchLogsFailure,
} = tripSlice.actions;
export default tripSlice.reducer;
