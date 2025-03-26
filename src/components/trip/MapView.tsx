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
}

const MapView: React.FC<MapViewProps> = ({ trip }) => {
  const parseCoordinates = (coord: string) => {
    const [lon, lat] = coord.split(",").map(Number);
    return [lat, lon] as [number, number];
  };

  const currentPos = parseCoordinates(trip.current_location);
  const pickupPos = parseCoordinates(trip.pickup_location);
  const dropoffPos = parseCoordinates(trip.dropoff_location);

  // Simulate route (in a real app, this would come from the Mapbox route_details)
  const route = [currentPos, pickupPos, dropoffPos];

  // Extract stops from trip
  const stops = trip.stops || [];

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <MapContainer
        center={currentPos}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={route} color="blue" />
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
          const stopPos = parseCoordinates(
            stop.location.split("near ")[1] || stop.location
          );
          return (
            <Marker key={index} position={stopPos}>
              <Popup>
                {stop.status} at {stop.location} for {stop.duration} hours
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
