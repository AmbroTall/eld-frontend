import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchLogsStart,
  fetchLogsSuccess,
  fetchLogsFailure,
} from "../store/slices/tripSlice";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import LogSheet from "../components/trip/LogSheet";
import { DailyLog } from "../types/trip";
import { fetchTripLogs } from "../services/api";

const TripLogs: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector(
    (state: RootState) => state.trips
  );

  useEffect(() => {
    const loadLogs = async () => {
      dispatch(fetchLogsStart());
      try {
        const logsData = await fetchTripLogs(Number(tripId));
        dispatch(fetchLogsSuccess(logsData));
      } catch (err: any) {
        dispatch(fetchLogsFailure(err.message));
        toast.error("Failed to fetch logs: " + err.message);
      }
    };
    loadLogs();
  }, [dispatch, tripId]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error)
    return <div className="text-center p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Logs for Trip #{tripId}
      </h1>
      {logs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No logs found for this trip.
        </p>
      ) : (
        <div className="space-y-6">
          {logs.map((log: DailyLog) => (
            <LogSheet key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TripLogs;
