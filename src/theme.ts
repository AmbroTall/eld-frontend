import { createTheme, ThemeOptions } from "@mui/material/styles";
import React from "react";

// Base theme configuration that's shared between light and dark modes
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
        },
        containedPrimary: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            fontWeight: 600,
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
};

// Light theme configuration
const lightThemeOptions: ThemeOptions = {
  ...baseThemeOptions,
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // Blue
      light: "#4791db",
      dark: "#115293",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057", // Pink
      light: "#f73378",
      dark: "#ab003c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
      disabled: "#9e9e9e",
    },
    divider: "rgba(0,0,0,0.12)",
  },
};

// Dark theme configuration
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#4db6ac", // Softer teal instead of blue
      light: "#82e9de",
      dark: "#00867d",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f06292", // Softer pink
      light: "#f8bbd0",
      dark: "#ba2d65",
      contrastText: "#ffffff",
    },
    background: {
      default: "#121212", // Very dark gray, not pure black
      paper: "#1e1e1e", // Slightly lighter than default
    },
    text: {
      primary: "#e0e0e0", // Soft white instead of pure white
      secondary: "#a0a0a0", // Muted gray
      disabled: "#606060",
    },
    divider: "rgba(255,255,255,0.12)",
    action: {
      active: "#4db6ac", // Primary color for active elements
      hover: "rgba(77,182,172,0.08)", // Subtle hover effect
      selected: "rgba(77,182,172,0.16)",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e", // Distinct from background
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)", // Subtle shadow
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#252525", // Slightly different from background
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          },
        },
      },
    },
  },
};

// Create themes
const lightTheme = createTheme(lightThemeOptions);
const darkTheme = createTheme(darkThemeOptions);

// Theme selector function with type safety
export const getTheme = (mode: "light" | "dark") =>
  mode === "light" ? lightTheme : darkTheme;

// Optional: Theme context hook for React applications
export const useColorMode = () => {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  const toggleColorMode = React.useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return { mode, theme, toggleColorMode };
};
