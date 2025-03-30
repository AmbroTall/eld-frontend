import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchLogsStart,
  fetchLogsSuccess,
  fetchLogsFailure,
  addLog,
  removeLog,
  setCurrentTrip,
  updateLog,
} from "../store/slices/tripSlice";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import DriversLogSheet from "../components/trip/LogSheet"; // Using DriversLogSheet
import { DailyLog } from "../types/log";
import { fetchTripLogs, fetchTrips, deleteTripLog } from "../services/api";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { Add, Map as MapIcon, Close } from "@mui/icons-material";
import MapView from "../components/trip/MapView";

const TripLogs: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const numericTripId = Number(tripId);
  const [isCreating, setIsCreating] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();
  const { logs, loading, error, currentTrip } = useSelector(
    (state: RootState) => state.trips
  );

  useEffect(() => {
    const loadData = async () => {
      dispatch(fetchLogsStart());
      try {
        const [tripsResponse, logsData] = await Promise.all([
          fetchTrips(),
          fetchTripLogs(numericTripId),
        ]);
        const foundTrip = tripsResponse.results.find(
          (trip) => trip.id === numericTripId
        );
        console.log("Current Trip", foundTrip);
        dispatch(setCurrentTrip(foundTrip || null));
        dispatch(fetchLogsSuccess(logsData));
      } catch (err: any) {
        dispatch(fetchLogsFailure(err.message));
        toast.error("Failed to fetch data: " + err.message);
      }
    };
    loadData();
  }, [dispatch, numericTripId]);

  const today = new Date().toISOString().split("T")[0]; // "2025-03-28"
  const hasLogForToday = logs.some((log) => log.date === today);

  const handleCreateNewLog = async () => {
    setIsCreating(true);
    try {
      const defaultLog: Omit<DailyLog, "id"> = {
        trip: numericTripId,
        date: today,
        from_location: "",
        to_location: "",
        driver_name: "",
        co_driver_name: "",
        home_terminal: "",
        main_office_address: "",
        carrier_name: "",
        total_miles_driving: "0",
        total_mileage: "0",
        truck_number: "",
        trailer: "",
        time_entries: {
          offDuty: [],
          sleeperBerth: [],
          driving: [],
          onDuty: [],
        },
        remarks: [],
        shipping_documents: "",
        recap_total_hours: "0",
        pickup_at: "",
        delivery_at: "",
        starting_time: "08:00",
        ending_time: "17:00",
      };

      // Since backend handles creation/update via POST, we don’t need a separate createTripLog call here
      const response = await fetch(`/api/trips/${numericTripId}/logs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultLog),
      });
      const createdLog = await response.json();
      if (response.status === 200) {
        dispatch(updateLog(createdLog)); // Backend updated an existing log
      } else if (response.status === 201) {
        dispatch(addLog(createdLog)); // Backend created a new log
      }
      toast.success("New log sheet created!");
    } catch (err: any) {
      toast.error("Failed to create log: " + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteLog = async (logId: number) => {
    try {
      await deleteTripLog(numericTripId, logId);
      dispatch(removeLog(logId));
      toast.success("Log deleted successfully!");
    } catch (err: any) {
      toast.error("Failed to delete log: " + err.message);
    }
  };

  const handleOpenMapModal = () => setMapModalOpen(true);
  const handleCloseMapModal = () => setMapModalOpen(false);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error" variant="h6" align="center">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          mb: 4,
          gap: 2,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          Logs for Trip #{tripId}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            onClick={handleOpenMapModal}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            View Map
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateNewLog}
            disabled={isCreating || hasLogForToday} // Disabled only for today’s log
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {isCreating ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "New Log Sheet"
            )}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {logs.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              No logs available for this trip
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Create your first log sheet to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateNewLog}
              disabled={isCreating || hasLogForToday}
            >
              Create New Log Sheet
            </Button>
          </Paper>
        ) : (
          logs.map((log: DailyLog) => (
            <Paper key={log.id} elevation={2}>
              <DriversLogSheet
                log={log}
                tripId={numericTripId}
                onDelete={handleDeleteLog}
              />
            </Paper>
          ))
        )}
      </Box>

      <Dialog
        open={mapModalOpen}
        onClose={handleCloseMapModal}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{ bgcolor: theme.palette.primary.main, color: "white", py: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Trip Map & Details
            </Typography>
            <IconButton onClick={handleCloseMapModal} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            height: "80vh",
          }}
        >
          {/* Map Section */}
          <Box sx={{ flex: 1, minHeight: "40vh", position: "relative" }}>
            {currentTrip && (
              <MapView
                trip={currentTrip}
                sx={{
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            )}
          </Box>

          {/* Trip and Stop Details Section */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              bgcolor: theme.palette.background.paper,
              overflowY: "auto",
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {currentTrip ? (
              <>
                {/* Trip Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <MapIcon color="primary" />
                    Trip Overview
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>From:</strong>{" "}
                        {currentTrip.current_location_name || "Not specified"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Pickup:</strong>{" "}
                        {currentTrip.pickup_location_name || "Not specified"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Drop-off:</strong>{" "}
                        {currentTrip.dropoff_location_name || "Not specified"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Status:</strong>{" "}
                        <Chip
                          label={(currentTrip.status || "Active").toUpperCase()}
                          size="small"
                          color={
                            currentTrip.status === "completed"
                              ? "success"
                              : currentTrip.status === "in-progress"
                              ? "primary"
                              : "info"
                          }
                          sx={{ fontWeight: 500 }}
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Created:</strong>{" "}
                        {new Date(currentTrip.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Cycle Hours:</strong>{" "}
                        {currentTrip.current_cycle_hours || 0} hrs
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Stop Details */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Add color="primary" />
                    Stops & Rests
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {currentTrip.stops && currentTrip.stops.length > 0 ? (
                    <Grid container spacing={2}>
                      {currentTrip.stops.map((stop: any, index: number) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            elevation={2}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor:
                                stop.status === "off_duty"
                                  ? theme.palette.info.light
                                  : theme.palette.warning.light,
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: 4,
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                              }}
                            >
                              {stop.status === "off_duty"
                                ? "Rest Stop"
                                : "Fuel/Other Stop"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Location:</strong> {stop.location}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Time:</strong> {stop.time}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Duration:</strong> {stop.duration} hours
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center" }}
                    >
                      No stops or rests recorded for this trip.
                    </Typography>
                  )}
                </Box>
              </>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", p: 3 }}
              >
                No trip data available.
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TripLogs;
