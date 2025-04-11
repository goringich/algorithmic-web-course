import React, { createContext, ReactNode, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


declare module "@mui/material/styles" {
  interface Palette {
    purple: {
      light: string;
      main: string;
      dark: string;
      onHover: string;
      toClick: string;
    };
  }
  interface PaletteOptions {
    purple?: {
      light?: string;
      main?: string;
      dark?: string;
      contrastText?: string;
      onHover?: string;
      toClick?: string;
    };
  }
  interface TypeBackground {
    card: string;
    cardContent: string;
    textCard: string;
  }
  interface Theme {
    shape: {
      borderRadius: string;
      cardRadius: string; 
    };
  }
  interface ThemeOptions {
    shape?: {
      borderRadius?: string;
      cardRadius?: string;
    };
  }
  interface TypeText {
    white: string;
    black: string;
  }
}

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === "dark" ? "#2A2431" : "#F8F8F8",
        paper: mode === "dark" ? "#2A2431" : "#fff",
        card: mode === "dark" ? "#4C405F" : "#eaddff",
        cardContent: mode === "dark" ? "#322E3B": "#EEEAF6",
        textCard: mode === "dark" ? "#40394B": "#EEEEEE",
      },
      text: {
        primary: mode === "dark" ? "#fff" : "#000",
        secondary: mode === "dark" ? "#000" : "#fff",
        white: "#fff",
        black: "#000"
      },
      error: { main: mode === "light" ? "#810F0F" : "#EA5D5D"}, 
      grey: { 
        500: "#b0afaf",
       }, 
      purple: { 
        light: "#B13EEA",
        main: "#9b59b6",
        dark : mode === "light" ? "#755088" : "#B294C1",
        onHover: mode === "light" ? "238, 230, 255" : "88, 77, 104",
        toClick: mode === "light" ? "#D3C5F4" : "#6B5195"},
    },
    typography: {
      fontFamily: "'Comfortaa', cursive",
      h1: {
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: "70px",
        lineHeight: "1.2",
        fontWeight: "bold",
        letterSpacing: "1px"
      },
      allVariants: {
        wordBreak: "break-word",
        textTransform: "none",
      },
    },
    spacing: 4,
    shape: {
      borderRadius: "8px", 
      cardRadius: "20px",
    },
  }); 


interface ThemeContextType {
  mode: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
