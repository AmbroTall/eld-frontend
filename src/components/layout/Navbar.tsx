import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  DirectionsCar,
  AddCircleOutline,
} from "@mui/icons-material";
import LogoutButton from "../auth/LogoutButton";
import { Login, PersonAdd, AccountCircle } from "@mui/icons-material";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Check authentication state
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1300, // Static value instead of theme.zIndex.drawer + 1
          background:
            "linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #64b5f6 100%)", // Static gradient (removed dark mode logic)
          boxShadow: "none",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)", // Static border color
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Brand Logo - Always visible */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                <DirectionsCar sx={{ mr: 1, fontSize: "2rem" }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.05rem",
                  }}
                >
                  ELD Tracker
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            // Authenticated User View
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Link to="/trips" style={{ textDecoration: "none" }}>
                <Button
                  color="inherit"
                  startIcon={<DirectionsCar />}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Trips
                </Button>
              </Link>
              <Link to="/create-trip" style={{ textDecoration: "none" }}>
                <Button
                  color="inherit"
                  startIcon={<AddCircleOutline />}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  New Trip
                </Button>
              </Link>

              {/* User Profile */}
              <Link to="/profile" style={{ textDecoration: "none" }}>
                <Chip
                  avatar={
                    <Avatar src={user?.avatar}>
                      <AccountCircle />
                    </Avatar>
                  }
                  variant="outlined"
                  sx={{
                    ml: 2,
                    color: "white",
                    borderColor: "rgba(255,255,255,0.3)",
                    "& .MuiChip-avatar": { color: "#1976d2" }, // Static color
                  }}
                />
              </Link>

              <LogoutButton />
            </Box>
          ) : (
            // Unauthenticated User View
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  color="inherit"
                  startIcon={<Login />}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </Box>
          )}

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 250,
            bgcolor: "#ffffff", // Static background color
            border: "1px solid rgba(0, 0, 0, 0.12)", // Static border color
          },
        }}
      >
        {isAuthenticated
          ? [
              <MenuItem
                key="profile"
                component={Link}
                to="/profile"
                onClick={handleMenuClose}
              >
                <ListItemIcon>
                  <AccountCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>,
              <Divider key="divider1" />,
              <MenuItem
                key="trips"
                component={Link}
                to="/trips"
                onClick={handleMenuClose}
              >
                <ListItemIcon>
                  <DirectionsCar color="primary" />
                </ListItemIcon>
                <ListItemText primary="My Trips" />
              </MenuItem>,
              <MenuItem
                key="create-trip"
                component={Link}
                to="/create-trip"
                onClick={handleMenuClose}
              >
                <ListItemIcon>
                  <AddCircleOutline color="primary" />
                </ListItemIcon>
                <ListItemText primary="New Trip" />
              </MenuItem>,
              <Divider key="divider2" />,
              <MenuItem key="logout" onClick={handleMenuClose}>
                <LogoutButton fullWidth />
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="login"
                component={Link}
                to="/login"
                onClick={handleMenuClose}
              >
                <ListItemIcon>
                  <Login color="primary" />
                </ListItemIcon>
                <ListItemText primary="Sign In" />
              </MenuItem>,
              <MenuItem
                key="register"
                component={Link}
                to="/register"
                onClick={handleMenuClose}
              >
                <ListItemIcon>
                  <PersonAdd color="primary" />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </MenuItem>,
            ]}
      </Menu>

      {/* Spacer for content below fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default Navbar;
