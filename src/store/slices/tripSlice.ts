import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Trip } from "../../types/trip";
import { DailyLog } from "../../types/log";

interface TripState {
  trips: Trip[];
  logs: DailyLog[];
  currentTrip: Trip | null;
  error: string | null;
  loading: boolean;
  lastFetched: number | null; // Add timestamp
}

const initialState: TripState = {
  trips: [],
  logs: [],
  currentTrip: null,
  error: null,
  loading: false,
  lastFetched: null,
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setCurrentTrip(state, action: PayloadAction<Trip | null>) {
      state.currentTrip = action.payload;
    },

    fetchTripsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTripsSuccess(state, action: PayloadAction<Trip[]>) {
      state.trips = action.payload.results;
      state.loading = false;
      state.lastFetched = Date.now(); // Set timestamp
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
    // Add this new reducer
    addLog(state, action: PayloadAction<DailyLog>) {
      state.logs.unshift(action.payload); // Add new log at beginning
    },
    updateLog(state, action: PayloadAction<DailyLog>) {
      const index = state.logs.findIndex((log) => log.id === action.payload.id);
      if (index !== -1) {
        state.logs[index] = action.payload;
      }
    },
    removeLog(state, action: PayloadAction<number>) {
      state.logs = state.logs.filter((log) => log.id !== action.payload);
    },
  },
});

export const {
  setCurrentTrip,
  fetchTripsStart,
  fetchTripsSuccess,
  fetchTripsFailure,
  fetchLogsStart,
  fetchLogsSuccess,
  fetchLogsFailure,
  addLog,
  updateLog,
  removeLog,
} = tripSlice.actions;
export default tripSlice.reducer;
