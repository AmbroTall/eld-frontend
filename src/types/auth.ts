export interface User {
  id: number;
  username: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  license_number: string;
  truck_number: string;
  carrier_name: string;
  main_office_address: string;
  home_terminal_address: string;
}
