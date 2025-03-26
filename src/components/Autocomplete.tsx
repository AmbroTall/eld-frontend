import React, { useState } from "react";
import Autocomplete from "react-google-autocomplete";

const LocationPicker = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handlePlaceSelected = (place) => {
    const { geometry, formatted_address } = place;
    if (geometry) {
      const coordinates = {
        lat: geometry.location.lat(),
        lng: geometry.location.lng(),
      };
      setSelectedLocation({ name: formatted_address, coordinates });
      console.log("Selected location:", formatted_address, coordinates);
    }
  };

  return (
    <div>
      <label htmlFor="location">Search for a location:</label>
      <Autocomplete
        apiKey="YOUR_GOOGLE_API_KEY" // Replace with your actual API key
        onPlaceSelected={handlePlaceSelected}
        options={{
          types: ["geocode"], // Restricts results to geographic locations
        }}
        placeholder="Enter a location"
      />
      {selectedLocation && (
        <div>
          <p>Selected: {selectedLocation.name}</p>
          <p>
            Coordinates: {selectedLocation.coordinates.lat},{" "}
            {selectedLocation.coordinates.lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
