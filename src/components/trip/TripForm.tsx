import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTrip, fetchTrips } from "../../services/api";
import {
  fetchTripsStart,
  fetchTripsSuccess,
  fetchTripsFailure,
} from "../../store/slices/tripSlice";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  Place as PlaceIcon,
  MyLocation as CurrentLocationIcon,
  LocalShipping as TruckIcon,
  AccessTime as TimeIcon,
  Public as TimeZoneIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { TripInput } from "../../types/trip";
import moment from "moment-timezone";
import { debounce } from "lodash";

const detectTimezone = (): string => {
  try {
    if (typeof moment !== "undefined" && moment.tz) {
      return moment.tz.guess();
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    console.warn("Could not detect timezone, defaulting to America/New_York");
    return "America/New_York";
  }
};

const TripForm: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tripData, setTripData] = useState<TripInput>({
    current_location: "",
    current_location_name: "",
    pickup_location: "",
    pickup_location_name: "",
    dropoff_location: "",
    dropoff_location_name: "",
    current_cycle_hours: 0,
    time_zone: "",
  });

  const [loading, setLoading] = useState(false);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [timezoneDetected, setTimezoneDetected] = useState(false);

  useEffect(() => {
    const detectedTimezone = detectTimezone();
    setTripData((prev) => ({
      ...prev,
      time_zone: detectedTimezone,
    }));
    setTimezoneDetected(true);
  }, []);

  const fetchLocations = async (query: string) => {
    console.log("fetchLocations query:", query, typeof query);
    if (!query) {
      setLocationOptions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const options = response.data
        .filter((place: any) => place.display_name && place.lon && place.lat)
        .map((place: any) => ({
          label: String(place.display_name || ""),
          value: String(`${place.lon},${place.lat}`),
          name: String(place.display_name || ""),
        }));
      console.log("fetchLocations options:", options);
      setLocationOptions(options);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocationOptions([]);
    }
  };

  const fetchLocationsDebounced = debounce((query: string) => {
    fetchLocations(query || "");
  }, 300);

  const handleLocationSelect = (
    selectedOption: any,
    field: keyof TripInput,
    nameField: keyof TripInput
  ) => {
    setTripData({
      ...tripData,
      [field]: selectedOption ? String(selectedOption.value) : "",
      [nameField]: selectedOption ? selectedOption.name : "",
    });
  };

  const getSelectedOption = (field: keyof TripInput) => {
    const value = tripData[field];
    const name = tripData[(field + "_name") as keyof TripInput];
    if (!value || typeof value !== "string" || !name) return null;
    const selected = { label: String(name), value: String(value) };
    console.log(`getSelectedOption for ${field}:`, selected);
    return selected;
  };

  const customFilterOption = (option: any, rawInput: string) => {
    const input = rawInput || "";
    const label = option.label || "";
    return label.toLowerCase().includes(input.toLowerCase());
  };

  const handleDetectTimezone = () => {
    const detectedTimezone = detectTimezone();
    setTripData({ ...tripData, time_zone: detectedTimezone });
    setTimezoneDetected(true);
    toast.success(`Timezone detected: ${detectedTimezone}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !tripData.current_location ||
      !tripData.pickup_location ||
      !tripData.dropoff_location
    ) {
      toast.error("Please select all locations");
      return;
    }

    setLoading(true);
    try {
      const newTrip = await createTrip(tripData);
      dispatch(fetchTripsStart());
      const trips = await fetchTrips();
      dispatch(fetchTripsSuccess(trips));
      toast.success("Trip created successfully!");
      navigate(`/trips/${newTrip.id}/logs`);
    } catch (error: any) {
      dispatch(fetchTripsFailure(error.message));
      toast.error("Failed to create trip: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "56px",
      borderColor: theme.palette.mode === "dark" ? "#4B5563" : "#D1D5DB",
      backgroundColor: theme.palette.background.paper,
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
    }),
    option: (base: any, { isFocused }: any) => ({
      ...base,
      backgroundColor: isFocused ? theme.palette.action.hover : "transparent",
    }),
    input: (base: any) => ({
      ...base,
      color: theme.palette.text.primary,
    }),
    singleValue: (base: any) => ({
      ...base,
      color: theme.palette.text.primary,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: theme.palette.text.secondary,
    }),
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: theme.palette.background.paper,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <TruckIcon
            sx={{
              fontSize: 60,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Create New Trip
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter trip details to get started
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Current Location
              </Typography>
              <Select
                options={locationOptions}
                onInputChange={(value) => {
                  console.log("onInputChange value:", value, typeof value);
                  fetchLocationsDebounced(value);
                }}
                onChange={(option) =>
                  handleLocationSelect(
                    option,
                    "current_location",
                    "current_location_name"
                  )
                }
                value={getSelectedOption("current_location")}
                filterOption={customFilterOption}
                placeholder="Search for current location..."
                styles={selectStyles}
                components={{
                  DropdownIndicator: () => (
                    <CurrentLocationIcon
                      sx={{
                        color: theme.palette.action.active,
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Pickup Location
              </Typography>
              <Select
                options={locationOptions}
                onInputChange={(value) => {
                  console.log("onInputChange value:", value, typeof value);
                  fetchLocationsDebounced(value);
                }}
                onChange={(option) =>
                  handleLocationSelect(
                    option,
                    "pickup_location",
                    "pickup_location_name"
                  )
                }
                value={getSelectedOption("pickup_location")}
                filterOption={customFilterOption}
                placeholder="Search for pickup location..."
                styles={selectStyles}
                components={{
                  DropdownIndicator: () => (
                    <PlaceIcon
                      sx={{
                        color: theme.palette.action.active,
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Dropoff Location
              </Typography>
              <Select
                options={locationOptions}
                onInputChange={(value) => {
                  console.log("onInputChange value:", value, typeof value);
                  fetchLocationsDebounced(value);
                }}
                onChange={(option) =>
                  handleLocationSelect(
                    option,
                    "dropoff_location",
                    "dropoff_location_name"
                  )
                }
                value={getSelectedOption("dropoff_location")}
                filterOption={customFilterOption}
                placeholder="Search for dropoff location..."
                styles={selectStyles}
                components={{
                  DropdownIndicator: () => (
                    <PlaceIcon
                      sx={{
                        color: theme.palette.action.active,
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Cycle Hours"
                variant="outlined"
                type="number"
                value={tripData.current_cycle_hours}
                onChange={(e) =>
                  setTripData({
                    ...tripData,
                    current_cycle_hours: parseFloat(e.target.value) || 0,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  label="Time Zone"
                  variant="outlined"
                  value={tripData.time_zone}
                  onChange={(e) =>
                    setTripData({ ...tripData, time_zone: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimeZoneIcon
                          color={timezoneDetected ? "success" : "primary"}
                        />
                      </InputAdornment>
                    ),
                  }}
                  helperText={
                    timezoneDetected
                      ? "Auto-detected timezone"
                      : "Click detect to find your timezone"
                  }
                />
                <Button
                  variant="outlined"
                  onClick={handleDetectTimezone}
                  sx={{ minWidth: "auto", px: 2 }}
                  title="Detect timezone"
                >
                  <RefreshIcon />
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Trip"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default TripForm;
