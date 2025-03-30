import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import {
  DirectionsCar,
  Schedule,
  Assignment,
  ShowChart,
  Security,
  Group,
} from "@mui/icons-material";

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const features = [
    {
      icon: <DirectionsCar fontSize="large" color="primary" />,
      title: "Trip Management",
      description:
        "Easily create, track, and manage all your trips in one place.",
    },
    {
      icon: <Schedule fontSize="large" color="primary" />,
      title: "HOS Compliance",
      description: "Automatically track hours of service to ensure compliance.",
    },
    {
      icon: <Assignment fontSize="large" color="primary" />,
      title: "Log Auditing",
      description: "Detailed logs for easy auditing and record keeping.",
    },
    {
      icon: <ShowChart fontSize="large" color="primary" />,
      title: "Performance Analytics",
      description: "Track your driving patterns and improve efficiency.",
    },
    {
      icon: <Security fontSize="large" color="primary" />,
      title: "Safety Features",
      description: "Built-in alerts for violations and potential issues.",
    },
    {
      icon: <Group fontSize="large" color="primary" />,
      title: "Fleet Management",
      description: "Manage multiple drivers and vehicles with ease.",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 4 : 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: isMobile ? 6 : 10,
          px: isMobile ? 2 : 0,
        }}
      >
        <Typography
          variant={isMobile ? "h3" : "h2"}
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 3,
          }}
        >
          Welcome to ELD App
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="p"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 800,
            mx: "auto",
            mb: 4,
          }}
        >
          The modern solution for electronic logging devices and hours of
          service compliance. Manage your trips and logs with ease while staying
          compliant with regulations.
        </Typography>
        {isAuthenticated ? (
          <Button
            component={Link}
            to="/create-trip"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Create a New Trip
          </Button>
        ) : (
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Login to Get Started
          </Button>
        )}
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: isMobile ? 6 : 10 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: isMobile ? 4 : 6,
          }}
        >
          Key Features
        </Typography>
        <Grid container spacing={isMobile ? 2 : 4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: "100%",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: "center",
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.grey[100],
          p: isMobile ? 4 : 6,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 3,
          }}
        >
          Ready to Get Started?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 600,
            mx: "auto",
            mb: 4,
          }}
        >
          Join thousands of drivers and fleet managers who trust our platform
          for their electronic logging needs.
        </Typography>
        <Button
          component={Link}
          to={isAuthenticated ? "/trips" : "/register"}
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          {isAuthenticated ? "View Your Trips" : "Sign Up Now"}
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
