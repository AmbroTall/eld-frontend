// src/components/trip/TripCard.tsx
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomCard from "../common/CustomCard";
import CustomButton from "../common/Button";
import {
  fetchLogsStart,
  fetchLogsSuccess,
  fetchLogsFailure,
} from "../../store/slices/tripSlice";
import { fetchTripLogs } from "../../services/api";

interface TripCardProps {
  trip: {
    id: number;
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_hours: number;
    time_zone: string;
  };
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleViewLogs = async () => {
    dispatch(fetchLogsStart());
    try {
      const logs = await fetchTripLogs(trip.id);
      dispatch(fetchLogsSuccess({ tripId: trip.id, logs }));
      navigate(`/trips/${trip.id}/logs`);
    } catch (error: unknown) {
      dispatch(
        fetchLogsFailure(error.response?.data?.error || "Failed to fetch logs")
      );
    }
  };

  return (
    <CustomCard title={`Trip #${trip.id}`}>
      <p>Current Location: {trip.current_location}</p>
      <p>Pickup Location: {trip.pickup_location}</p>
      <p>Dropoff Location: {trip.dropoff_location}</p>
      <p>Current Cycle Hours: {trip.current_cycle_hours}</p>
      <p>Time Zone: {trip.time_zone}</p>
      <CustomButton
        label="View Logs"
        variant="outlined"
        color="primary"
        onClick={handleViewLogs}
      />
    </CustomCard>
  );
};

export default TripCard;
