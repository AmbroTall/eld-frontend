export interface TripInput {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_hours: number;
  pickup_location_name: string;
  dropoff_location_name: string;
  current_location_name: string;
  time_zone: string;
}

export interface Trips {
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

export interface Trip {
  pickup_location_name: any;
  dropoff_location_name: any;
  created_at: string | number | Date;
  id: Key | null | undefined;
  status: string;
  results: Trips[]; // results contain the actual trips
  count: number; // total number of trips (optional)
  next?: string; // next page URL (optional)
  previous?: string; // previous page URL (optional)
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
