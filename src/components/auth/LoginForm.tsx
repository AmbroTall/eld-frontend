import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../services/api";
import { loginSuccess, loginFailure } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Person, ArrowForward } from "@mui/icons-material";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(credentials);
      dispatch(loginSuccess(user));
      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      toast.error("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ minHeight: "100vh", p: 2 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Lock color="primary" sx={{ fontSize: 60 }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mt: 2,
                color: theme.palette.text.primary,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                mt: 1,
              }}
            >
              Sign in to manage your trips and logs
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <Person sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <Lock sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
                mt: 2,
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              endIcon={<ArrowForward />}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: theme.palette.text.secondary,
              }}
            >
              Don't have an account?
              <Link
                to="/register"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    textDecoration: "none",
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
