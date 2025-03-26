import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTrip, fetchTrips } from "../../services/api";
import {
  fetchTripsStart,
  fetchTripsSuccess,
  fetchTripsFailure,
} from "../../store/slices/tripSlice";
import { toast } from "react-toastify";
import Autocomplete from "react-google-autocomplete";
import Input from "../common/Input";
import Button from "../common/Button";
import { TripInput } from "../../types/trip";

const TripForm: React.FC = () => {
  const dispatch = useDispatch();
  const [tripData, setTripData] = useState<TripInput>({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_hours: 0,
    time_zone: "America/New_York",
  });
  const [currentLocationInput, setCurrentLocationInput] = useState("");
  const [pickupLocationInput, setPickupLocationInput] = useState("");
  const [dropoffLocationInput, setDropoffLocationInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler for when a place is selected in Autocomplete
  const handleLocationSelect = (
    place: any,
    field: keyof TripInput,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setTripData({
      ...tripData,
      [field]: `${lng},${lat}`, // Store coordinates as "lon,lat"
    });
    setInput(place.formatted_address); // Display the location name
  };

  // Form submission with validation
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
      await createTrip(tripData);
      dispatch(fetchTripsStart());
      const trips = await fetchTrips(); // Assuming fetchTrips is defined elsewhere
      dispatch(fetchTripsSuccess(trips));
      toast.success("Trip created successfully!");
    } catch (error: any) {
      setLoading(false);

      if (error.response && error.response.data) {
        const errorData = error.response.data;

        // Extract error messages from the response
        const errorMessages = Object.entries(errorData)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join("\n");

        dispatch(fetchTripsFailure(errorMessages));
        toast.error(`Failed to create trip:\n${errorMessages}`);
      } else {
        dispatch(fetchTripsFailure(error.message));
        toast.error("Failed to create trip: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Create a Trip
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Please select locations using the search inputs below.
      </p>

      {/* Current Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Location
        </label>
        <Autocomplete
          apiKey="YOUR_GOOGLE_API_KEY" // Replace with your actual API key
          onPlaceSelected={(place) =>
            handleLocationSelect(
              place,
              "current_location",
              setCurrentLocationInput
            )
          }
          value={currentLocationInput}
          onChange={(e) => setCurrentLocationInput(e.target.value)}
          placeholder="Search for current location"
          className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Pickup Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Pickup Location
        </label>
        <Autocomplete
          apiKey="YOUR_GOOGLE_API_KEY" // Replace with your actual API key
          onPlaceSelected={(place) =>
            handleLocationSelect(
              place,
              "pickup_location",
              setPickupLocationInput
            )
          }
          value={pickupLocationInput}
          onChange={(e) => setPickupLocationInput(e.target.value)}
          placeholder="Search for pickup location"
          className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Dropoff Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Dropoff Location
        </label>
        <Autocomplete
          apiKey="YOUR_GOOGLE_API_KEY" // Replace with your actual API key
          onPlaceSelected={(place) =>
            handleLocationSelect(
              place,
              "dropoff_location",
              setDropoffLocationInput
            )
          }
          value={dropoffLocationInput}
          onChange={(e) => setDropoffLocationInput(e.target.value)}
          placeholder="Search for dropoff location"
          className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Other Fields */}
      <Input
        label="Current Cycle Hours"
        value={tripData.current_cycle_hours}
        onChange={(e) =>
          setTripData({
            ...tripData,
            current_cycle_hours: parseFloat(e.target.value),
          })
        }
        name="current_cycle_hours"
        type="number"
        placeholder="0"
      />
      <Input
        label="Time Zone"
        value={tripData.time_zone}
        onChange={(e) =>
          setTripData({
            ...tripData,
            time_zone: e.target.value,
          })
        }
        name="time_zone"
        placeholder="America/New_York"
      />

      <Button onClick={() => {}} disabled={loading}>
        {loading ? "Creating..." : "Create Trip"}
      </Button>
    </form>
  );
};

export default TripForm;
