// src/pages/Dashboard.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Grid, Alert } from "@mui/material";
import TripCard from "../components/trip/TripCard";
import TripForm from "../components/trip/TripForm";
import {
  fetchTripsStart,
  fetchTripsSuccess,
  fetchTripsFailure,
} from "../store/slices/tripSlice";
import { RootState } from "../store/store";
import { fetchTrips } from "../services/api";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { trips, loading, error } = useSelector(
    (state: RootState) => state.trips
  );

  useEffect(() => {
    const loadTrips = async () => {
      dispatch(fetchTripsStart());
      try {
        const data = await fetchTrips();
        dispatch(fetchTripsSuccess(data));
      } catch (error: any) {
        dispatch(
          fetchTripsFailure(
            error.response?.data?.error || "Failed to fetch trips"
          )
        );
      }
    };
    loadTrips();
  }, [dispatch]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Driver Dashboard
      </Typography>
      <TripForm onSuccess={() => window.location.reload()} />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {trips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip.id}>
              <TripCard trip={trip} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
