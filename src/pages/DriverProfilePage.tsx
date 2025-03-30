import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  AccountCircle,
  Badge,
  LocalShipping,
  Business,
  Home,
  Edit,
  Check,
} from "@mui/icons-material";
import { fetchProfile, updateProfile } from "../services/api";
import { toast } from "react-toastify";

const DriverProfilePage = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    license_number: "",
    truck_number: "",
    carrier_name: "",
    main_office_address: "",
    home_terminal_address: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        console.log("Data", data);
        setProfile(data);
        setFormData({
          license_number: data.license_number,
          truck_number: data.truck_number,
          carrier_name: data.carrier_name,
          main_office_address: data.main_office_address,
          home_terminal_address: data.home_terminal_address,
        });
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: theme.palette.background.paper,
        }}
      >
        {/* Profile Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            My Driver Profile
          </Typography>

          {editing ? (
            <Button
              variant="contained"
              startIcon={<Check />}
              onClick={handleSave}
              disabled={loading}
              sx={{
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setEditing(true)}
              sx={{
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Profile Content */}
        <Grid container spacing={4}>
          {/* Avatar and Basic Info */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 3,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                <AccountCircle sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {profile?.user?.first_name} {profile?.user?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Professional Driver
              </Typography>
              <Chip
                label="Verified Driver"
                color="success"
                size="small"
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* License Number */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  License Number
                </Typography>
                {editing ? (
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: "1rem",
                    }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Badge color="primary" sx={{ fontSize: "1rem" }} />
                    {profile?.license_number}
                  </Typography>
                )}
              </Grid>

              {/* Truck Number */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Truck Number
                </Typography>
                {editing ? (
                  <input
                    type="text"
                    name="truck_number"
                    value={formData.truck_number}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: "1rem",
                    }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocalShipping color="primary" sx={{ fontSize: "1rem" }} />
                    {profile?.truck_number}
                  </Typography>
                )}
              </Grid>

              {/* Carrier Name */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Carrier Name
                </Typography>
                {editing ? (
                  <input
                    type="text"
                    name="carrier_name"
                    value={formData.carrier_name}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: "1rem",
                    }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Business color="primary" sx={{ fontSize: "1rem" }} />
                    {profile?.carrier_name}
                  </Typography>
                )}
              </Grid>

              {/* Office Address */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Main Office Address
                </Typography>
                {editing ? (
                  <textarea
                    name="main_office_address"
                    value={formData.main_office_address}
                    onChange={handleInputChange}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: "1rem",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Business
                      color="primary"
                      sx={{ fontSize: "1rem", mt: 0.5 }}
                    />
                    {profile?.main_office_address}
                  </Typography>
                )}
              </Grid>

              {/* Home Terminal */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Home Terminal Address
                </Typography>
                {editing ? (
                  <textarea
                    name="home_terminal_address"
                    value={formData.home_terminal_address}
                    onChange={handleInputChange}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: "1rem",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Home color="primary" sx={{ fontSize: "1rem", mt: 0.5 }} />
                    {profile?.home_terminal_address}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DriverProfilePage;
