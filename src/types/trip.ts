export interface TripInput {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_hours: number;
  time_zone: string;
}

export interface Trip {
  id: number;
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_hours: number;
  time_zone: string;
  route_details: unknown;
  stops: Array<{
    time: string;
    status: string;
    location: string;
    duration: number;
  }>;
}

export interface DailyLog {
  id: number;
  tripId: number;
  trip: number;
  date: string;
  log_entries: Array<{
    time: string;
    status: string;
    location: string;
    duration: number;
  }>;
  total_miles: number;
  remarks: string;
}
