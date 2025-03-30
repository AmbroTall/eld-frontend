import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  ThemeOptions,
  createTheme,
} from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

// Define your theme color palettes
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: mode === "light" ? "#3a86ff" : "#90caf9",
      light: mode === "light" ? "#63a4ff" : "#9cd2ff",
      dark: mode === "light" ? "#005cb2" : "#5c9ce6",
    },
    secondary: {
      main: mode === "light" ? "#f77f00" : "#ffb74d",
      light: mode === "light" ? "#ffb347" : "#ffe97d",
      dark: mode === "light" ? "#c25e00" : "#c77c02",
    },
    background: {
      default: mode === "light" ? "#f7f9fc" : "#121212",
      paper: mode === "light" ? "#ffffff" : "#1e1e1e",
    },
    text: {
      primary: mode === "light" ? "#2d3748" : "#e0e0e0",
      secondary: mode === "light" ? "#718096" : "#a0aec0",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
          padding: "8px 16px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            mode === "light"
              ? "0px 4px 20px rgba(0, 0, 0, 0.05)"
              : "0px 4px 20px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            mode === "light"
              ? "0 2px 10px rgba(0, 0, 0, 0.05)"
              : "0 2px 10px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
});

type ThemeContextType = {
  toggleColorMode: () => void;
  mode: PaletteMode;
};

export const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  mode: "light",
});

export const useThemeContext = () => useContext(ThemeContext);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const colorMode = {
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    },
    mode,
  };

  const theme = createTheme(getDesignTokens(mode) as ThemeOptions);

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
