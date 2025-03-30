# ELD (Electronic Logging Device) Frontend

## Overview

This is the frontend application for an Electronic Logging Device (ELD) system designed for truck drivers and fleet managers. It provides a modern, responsive interface for managing trips, logs, and driver profiles while complying with FMCSA regulations.

## Features

- **Trip Management**
  - Create, view, and manage trips
  - Interactive map visualization of routes
  - Filter and sort trips by date, location, and status
- **Log Management**
  - Electronic log sheets (ELDs) compliant with FMCSA regulations
  - Hours of Service (HOS) tracking
  - Status changes (Driving, On Duty, Off Duty, Sleeper Berth)
- **Driver Profiles**
  - View and edit driver information
  - License and vehicle details
  - Carrier information
- **Responsive Design**
  - Works on desktop, tablet, and mobile devices
  - Adaptive layout for different screen sizes

## Technologies Used

- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI) v5
- **Mapping**: React-Leaflet
- **Date Handling**: Day.js
- **Routing**: React Router v6
- **API Client**: Axios
- **Form Handling**: Formik + Yup validation
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- Backend API server (see backend documentation)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/the-repo/eld-frontend.git
cd eld-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your environment variables:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### Running the Application

Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── assets/            # Static assets (images, fonts)
├── components/        # Reusable components
│   ├── common/        # Generic components (buttons, inputs)
│   ├── trip/          # Trip-related components
│   └── auth/          # Authentication components
├── hooks/             # Custom React hooks
├── services/          # API service layer
├── store/             # Redux store configuration
│   ├── slices/        # Redux slices
│   └── store.ts       # Store configuration
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── views/             # Main page components
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Available Scripts

- `start`: Runs the app in development mode
- `build`: Builds the app for production
- `test`: Runs unit tests
- `lint`: Runs ESLint for code quality checks
- `format`: Formats code using Prettier
- `cypress:open`: Opens Cypress for E2E testing

## Configuration

The application can be configured through environment variables:

| Variable                      | Description                        | Default               |
| ----------------------------- | ---------------------------------- | --------------------- |
| REACT_APP_API_BASE_URL        | Base URL for API requests          | http://localhost:8000 |
| REACT_APP_MAPBOX_ACCESS_TOKEN | Access token for Mapbox maps       | -                     |
| REACT_APP_DEFAULT_TIMEZONE    | Default timezone for date displays | America/New_York      |

## Testing

Run unit tests:

```bash
npm test
```

Run end-to-end tests (requires Cypress):

```bash
npm run cypress:open
```

## Deployment

To build the application for production:

```bash
npm run build
```

The build output will be in the `build/` directory, ready to be served by any static file server.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request

## License

MIT License

## Support

For support or questions, please contact ambrosetall@gmail.com
