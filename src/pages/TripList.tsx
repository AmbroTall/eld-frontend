import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchTripsStart,
  fetchTripsSuccess,
  fetchTripsFailure,
} from "../store/slices/tripSlice";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import { fetchTrips } from "../services/api";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Pagination,
  useTheme,
  useMediaQuery,
  Paper,
  Container,
  TextField,
  MenuItem,
  Chip,
  InputAdornment,
  Skeleton,
  Button,
} from "@mui/material";
import {
  DirectionsCar,
  Add,
  Search,
  FilterList,
  CalendarToday,
  Place,
  DateRange,
  Clear,
  Refresh,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import MapView from "../components/trip/MapView";

const TripList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    trips = [],
    loading,
    error,
    lastFetched,
  } = useSelector((state: RootState) => state.trips);

  // State for pagination, sorting, filtering, and refresh
  const [currentPage, setCurrentPage] = useState(1);
  const [tripsPerPage, setTripsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);
  const [forceRefresh, setForceRefresh] = useState(false);

  useEffect(() => {
    const loadTrips = async () => {
      const STALE_THRESHOLD = 5 * 60 * 1000;
      const now = Date.now();
      const isStale = !lastFetched || now - lastFetched > STALE_THRESHOLD;

      if (trips.length > 0 && !isStale && !forceRefresh) {
        console.log("Using persisted trips:", trips);
        return;
      }

      dispatch(fetchTripsStart());
      try {
        const tripsData = await fetchTrips();
        console.log("Fetched trips:", tripsData);
        dispatch(fetchTripsSuccess(tripsData));
      } catch (err: any) {
        dispatch(fetchTripsFailure(err.message));
        toast.error("Failed to fetch trips: " + err.message);
      } finally {
        setForceRefresh(false);
      }
    };
    loadTrips();
  }, [dispatch, trips, lastFetched, forceRefresh]);

  // Process trips with sorting and filtering (client-side)
  const processedTrips = React.useMemo(() => {
    let filteredTrips = [...trips];

    // Search filter
    if (searchTerm) {
      filteredTrips = filteredTrips.filter(
        (trip) =>
          trip.pickup_location_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          trip.dropoff_location_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Date filter - FIXED VERSION
    if (dateFilter) {
      filteredTrips = filteredTrips.filter((trip) => {
        try {
          // Ensure the date is properly parsed and compared
          const tripDate = dayjs(trip.created_at).startOf("day");
          const filterDate = dateFilter.startOf("day");
          return tripDate.isSame(filterDate);
        } catch (e) {
          console.error("Date comparison error:", e);
          return false;
        }
      });
    }

    // Sorting
    filteredTrips.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === "location") {
        return (
          a.pickup_location_name?.localeCompare(b.pickup_location_name) || 0
        );
      }
      return 0;
    });

    return filteredTrips;
  }, [trips, searchTerm, sortBy, dateFilter]);
  // Pagination
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = processedTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(processedTrips.length / tripsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    console.log("Changing to page:", value);
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTripsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTripsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleCardClick = (tripId: number) => {
    navigate(`/trips/${tripId}/logs`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateFilter(null);
    setSortBy("date");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton width="60%" height={32} />
                  <Skeleton width="40%" height={24} sx={{ mt: 1 }} />
                  <Skeleton width="80%" height={20} sx={{ mt: 2 }} />
                  <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <DirectionsCar
              fontSize="large"
              sx={{ color: theme.palette.primary.main }}
            />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, color: theme.palette.text.primary }}
            >
              My Trips
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => setForceRefresh(true)}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              Refresh
            </Button>
          </Box>
          <Button
            component={Link}
            to="/create-trip"
            variant="contained"
            startIcon={<Add />}
            size={isMobile ? "medium" : "large"}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            New Trip
          </Button>
        </Box>

        {/* Filter and Search Bar */}
        <Paper
          elevation={2}
          sx={{ p: 3, mb: 4, backgroundColor: theme.palette.background.paper }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Sort By"
                variant="outlined"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="date">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarToday fontSize="small" /> Date
                  </Box>
                </MenuItem>
                <MenuItem value="location">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Place fontSize="small" /> Location
                  </Box>
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Filter by date"
                value={dateFilter}
                onChange={(newValue: Dayjs | null) => {
                  setDateFilter(newValue);
                  setCurrentPage(1);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRange />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Chip
                  label={`${processedTrips.length} trips found`}
                  color="primary"
                  variant="outlined"
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClearFilters}
                  disabled={!searchTerm && !dateFilter && sortBy === "date"}
                  sx={{ textTransform: "none" }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Trip List */}
        {currentTrips.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {searchTerm || dateFilter
                ? "No matching trips found"
                : "No trips available"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {searchTerm || dateFilter
                ? "Try adjusting your filters"
                : "Create your first trip to get started"}
            </Typography>
            <Button
              component={Link}
              to="/create-trip"
              variant="contained"
              startIcon={<Add />}
            >
              Create New Trip
            </Button>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {currentTrips.map((trip) => (
                <Grid item xs={12} sm={6} md={4} key={trip.id}>
                  <Card
                    onClick={() => handleCardClick(trip.id)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box sx={{ height: 200, position: "relative" }}>
                      <MapView
                        trip={trip}
                        sx={{
                          height: "100%",
                          width: "100%",
                          position: "relative",
                          zIndex: 1,
                        }}
                      />
                      <Chip
                        label={trip.status || "Active"}
                        size="small"
                        color={
                          trip.status === "completed"
                            ? "success"
                            : trip.status === "in-progress"
                            ? "primary"
                            : "warning"
                        }
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          fontWeight: 500,
                          zIndex: 2,
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <CalendarToday fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(trip.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {trip.pickup_location_name} →{" "}
                        {trip.dropoff_location_name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination Section */}
            <Box sx={{ mt: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  gap: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Showing {indexOfFirstTrip + 1} to{" "}
                  {Math.min(indexOfLastTrip, processedTrips.length)} of{" "}
                  {processedTrips.length} trips
                </Typography>
                <TextField
                  select
                  label="Trips per page"
                  value={tripsPerPage}
                  onChange={handleTripsPerPageChange}
                  variant="outlined"
                  size="small"
                  sx={{ width: isMobile ? "100%" : 150 }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </TextField>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "large"}
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: theme.palette.text.primary,
                    },
                    "& .MuiPaginationItem-page.Mui-selected": {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                />
              </Box>
            </Box>
          </>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default TripList;
