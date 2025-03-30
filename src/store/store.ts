import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./slices/authSlice";
import tripsReducer from "./slices/tripSlice";
import themeReducer from "./slices/themeSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "trips", "theme"], // Persist all slices
};

// Combine reducers
const rootReducer = {
  auth: authReducer,
  trips: tripsReducer,
  theme: themeReducer,
};

// Create a persisted reducer
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(rootReducer)
);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
