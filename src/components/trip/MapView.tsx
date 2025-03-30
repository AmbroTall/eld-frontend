import React from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Trip } from "../../types/trip";
import { Box, SxProps, Theme } from "@mui/material";

// Fix for Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapViewProps {
  trip: Trip;
  sx?: SxProps<Theme>; // Add sx prop
}
const MapView: React.FC<MapViewProps> = ({ trip, sx }) => {
  const parseCoordinates = (coord: string) => {
    const [lon, lat] = coord.split(",").map(Number);
    return [lat, lon] as [number, number];
  };

  const currentPos = parseCoordinates(trip.current_location);
  const pickupPos = parseCoordinates(trip.pickup_location);
  const dropoffPos = parseCoordinates(trip.dropoff_location);

  // Extract route coordinates from trip.route_details (GeoJSON from ORS)
  const routeCoordinates =
    trip.route_details?.features?.[0]?.geometry?.coordinates || [];
  const route = routeCoordinates.map(
    ([lon, lat]: [number, number]) => [lat, lon] as [number, number]
  );

  const stops = trip.stops || [];

  return (
    <Box
      sx={{
        height: "24rem",
        width: "100%",
        borderRadius: "0.5rem",
        overflow: "hidden",
        ...sx,
      }}
    >
      <MapContainer
        center={currentPos}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline
          positions={
            route.length > 0 ? route : [currentPos, pickupPos, dropoffPos]
          }
          color="blue"
        />
        <Marker position={currentPos}>
          <Popup>Current Location</Popup>
        </Marker>
        <Marker position={pickupPos}>
          <Popup>Pickup Location</Popup>
        </Marker>
        <Marker position={dropoffPos}>
          <Popup>Dropoff Location</Popup>
        </Marker>
        {stops.map((stop, index) => {
          // Extract location string
          const locationStr = stop.location.split("near ")[1] || stop.location;
          let stopPos: [number, number];

          // Try to parse as coordinates
          try {
            stopPos = parseCoordinates(locationStr);
            // Validate coordinates
            if (
              !stopPos ||
              stopPos.length !== 2 ||
              isNaN(stopPos[0]) ||
              isNaN(stopPos[1])
            ) {
              throw new Error("Invalid coordinates");
            }
          } catch (error) {
            console.error(
              `Failed to parse coordinates for stop ${stop.location}:`,
              error
            );
            // Fallback: Use default coordinates or skip rendering
            stopPos = [0, 0]; // Default coordinates (you can adjust this)
            // Alternatively, return null to skip rendering the marker
            // return null;
          }

          return (
            <Marker key={index} position={stopPos}>
              <Popup>
                {stop.status} at {stop.location} for {stop.duration} hours
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default MapView;
