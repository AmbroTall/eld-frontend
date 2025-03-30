import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TripCard from "../components/trip/TripCard";
import TripForm from "../components/trip/TripForm";
import {
  fetchTripsStart,
  fetchTripsSuccess,
  fetchTripsFailure,
} from "../store/slices/tripSlice";
import { RootState } from "../store/store";
import { fetchTrips } from "../services/api";
import {
  AddCircleOutline,
  DirectionsCar,
  Schedule,
  Map,
} from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

  const stats = [
    {
      title: "Total Trips",
      value: trips.length,
      icon: <DirectionsCar fontSize="large" />,
    },
    {
      title: "Active Trips",
      value: trips.filter((t) => t.status === "active").length,
      icon: <Map fontSize="large" />,
    },
    {
      title: "Upcoming Trips",
      value: trips.filter((t) => t.status === "upcoming").length,
      icon: <Schedule fontSize="large" />,
    },
  ];

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <DirectionsCar fontSize="large" />
          Driver Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
          }}
        >
          Manage your trips and view important statistics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.9rem",
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Trip Form Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AddCircleOutline color="primary" />
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
            Create New Trip
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <TripForm onSuccess={() => window.location.reload()} />
      </Paper>

      {/* Trips List Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Map color="primary" />
          Your Trips
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>Loading your trips...</Typography>
          </Box>
        ) : trips.length === 0 ? (
          <Card sx={{ textAlign: "center", p: 4 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                No trips found. Create your first trip!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {trips.map((trip) => (
              <Grid item xs={12} sm={6} md={4} key={trip.id}>
                <TripCard trip={trip} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
