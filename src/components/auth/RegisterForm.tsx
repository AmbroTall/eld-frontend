import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../services/api";
import { registerSuccess, registerFailure } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  AccountCircle,
  Badge,
  LocalShipping,
  Business,
  Home,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  license_number: string;
  truck_number: string;
  carrier_name: string;
  main_office_address: string;
  home_terminal_address: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  license_number: Yup.string().required("License number is required"),
  truck_number: Yup.string().required("Truck number is required"),
  carrier_name: Yup.string().required("Carrier name is required"),
  main_office_address: Yup.string().required("Office address is required"),
  home_terminal_address: Yup.string().required("Home terminal is required"),
});

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik<RegisterCredentials>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      license_number: "",
      truck_number: "",
      carrier_name: "",
      main_office_address: "",
      home_terminal_address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const user = await register(values);
        dispatch(registerSuccess(user));
        toast.success("Registration successful!");
        navigate("/login");
      } catch (error: any) {
        dispatch(registerFailure(error.message));
        toast.error("Registration failed: " + error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 4,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        Driver Registration
      </Typography>
      <Divider sx={{ my: 3 }} />

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.first_name && Boolean(formik.errors.first_name)
              }
              helperText={formik.touched.first_name && formik.errors.first_name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.last_name && Boolean(formik.errors.last_name)
              }
              helperText={formik.touched.last_name && formik.errors.last_name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Driver Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ mt: 2, mb: 2, color: "text.secondary" }}
            >
              Driver Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="License Number"
              name="license_number"
              value={formik.values.license_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.license_number &&
                Boolean(formik.errors.license_number)
              }
              helperText={
                formik.touched.license_number && formik.errors.license_number
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Truck Number"
              name="truck_number"
              value={formik.values.truck_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.truck_number &&
                Boolean(formik.errors.truck_number)
              }
              helperText={
                formik.touched.truck_number && formik.errors.truck_number
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalShipping color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Carrier Name"
              name="carrier_name"
              value={formik.values.carrier_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.carrier_name &&
                Boolean(formik.errors.carrier_name)
              }
              helperText={
                formik.touched.carrier_name && formik.errors.carrier_name
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Main Office Address"
              name="main_office_address"
              value={formik.values.main_office_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.main_office_address &&
                Boolean(formik.errors.main_office_address)
              }
              helperText={
                formik.touched.main_office_address &&
                formik.errors.main_office_address
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Home Terminal Address"
              name="home_terminal_address"
              value={formik.values.home_terminal_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.home_terminal_address &&
                Boolean(formik.errors.home_terminal_address)
              }
              helperText={
                formik.touched.home_terminal_address &&
                formik.errors.home_terminal_address
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RegisterForm;
