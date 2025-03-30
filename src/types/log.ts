export interface LogEntry {
  start_time: number;
  end_time: number;
  status: string;
}

export interface StatusChange {
  time: number;
  status: "offDuty" | "sleeperBerth" | "driving" | "onDuty";
  location: string;
  activity: string;
}

export interface DailyLog {
  id: number;
  date: string;
  from_location: string;
  to_location: string;
  driver_name: string;
  co_driver_name: string;
  home_terminal: string;
  main_office_address: string;
  carrier_name: string;
  total_miles_driving: string;
  total_mileage: string;
  truck_number: string;
  trailer: string;
  time_entries: {
    offDuty: { start: number; end: number }[];
    sleeperBerth: { start: number; end: number }[];
    driving: { start: number; end: number }[];
    onDuty: { start: number; end: number }[];
  };
  remarks: StatusChange[];
  shipping_documents: string;
  recap_total_hours: string;
  pickup_at: string;
  delivery_at: string;
  starting_time: string;
  ending_time: string;
}
