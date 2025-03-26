import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTripsStart,
  fetchTripsSuccess,
  fetchTripsFailure,
} from "../store/slices/tripSlice";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MapView from "../components/trip/MapView";
import { fetchTrips } from "../services/api";

const TripList: React.FC = () => {
  const dispatch = useDispatch();
  const { trips, loading, error } = useSelector(
    (state: RootState) => state.trips
  );

  useEffect(() => {
    const loadTrips = async () => {
      dispatch(fetchTripsStart());
      try {
        const tripsData = await fetchTrips();
        dispatch(fetchTripsSuccess(tripsData));
      } catch (err: any) {
        dispatch(fetchTripsFailure(err.message));
        toast.error("Failed to fetch trips: " + err.message);
      }
    };
    loadTrips();
  }, [dispatch]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error)
    return <div className="text-center p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        My Trips
      </h1>
      {trips.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No trips found. Create a new trip to get started.
        </p>
      ) : (
        <div className="space-y-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Trip from {trip.current_location} to {trip.dropoff_location}
              </h2>
              <MapView trip={trip} />
              <Link
                to={`/trips/${trip.id}/logs`}
                className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Logs
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripList;
