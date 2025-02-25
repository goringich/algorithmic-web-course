// import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { PaletteMode, GlobalStyles } from '@mui/material';
// interface ThemeContextProps {
//   mode: PaletteMode;
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// export const ThemeProvider: React.FC<{ children : ReactNode }> = ({ children }) => {
//   // Save last theme in localStorage 
//   const [mode, setMode] = useState<PaletteMode>(() => {
//     const savedMode = localStorage.getItem('theme');
//     return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
//   });

//   const toggleTheme = () => setMode((prevMode) => {
//     const newMode = prevMode === 'light' ? 'dark' : 'light';
//     localStorage.setItem('theme', newMode);
//     return newMode;
//   });

//   const theme = createTheme({
//     palette: {
//       mode: mode,
//     },
//   })

//   useEffect(() => {
//     const root = document.documentElement;
//     root.classList.remove('theme-light', 'theme-dark', 'theme-initializing');
//     root.classList.add(`theme-${mode}`);
//   }, [mode]);
  
  

//   return (
//     <ThemeContext.Provider value={{ mode, toggleTheme }}>
//       <MuiThemeProvider theme={theme}>
//         <CssBaseline />  {/* Resetting the default browser styles */}
//         <GlobalStyles
//           styles={{
//             body: {
//               fontFamily: 'var(--primary-font)', 
//               backgroundColor: 'var(--background-color)', 
//               color: mode === 'light' ? '#000000' : '#ffffff', 
//               margin: 0, // Сбрасываем отступы браузера
//             },
//           }}
//         />
//         {children}
//       </MuiThemeProvider>
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () : ThemeContextProps => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context
// }

// import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#9b59b6",
//     },
//     secondary: {
//       main: "#fff",
//     },
//     background: {
//       default: "#F2F0F0",
//     },
//   },
//   typography: {
//     fontFamily: "'Comfortaa', cursive",
//     h1: {
//       fontSize: "2.5rem",
//       fontWeight: 700,
//     },
//     body1: {
//       fontSize: "1rem",
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           borderRadius: "7px",
//         },
//       },
//     },
//   },
// });

// export default theme;

import React, { createContext, ReactNode, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


declare module "@mui/material/styles" {
  interface Palette {
    purple: Palette["primary"]; 
  }
  interface PaletteOptions {
    purple?: PaletteOptions["primary"]; 
  }
}

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === "dark" ? "#2A2431" : "#F2F0F0",
        paper: mode === "dark" ? "#333333" : "#fff",
      },
      text: {
        primary: mode === "dark" ? "#fff" : "#000",
        secondary: mode === "dark" ? "#ccc" : "#fff",
      },
      error: { main: "#810F0F" }, // red
      grey: { 500: "#b0afaf" }, 
      purple: { 
        light: "#B13EEA",
        main: "#9b59b6",
        dark : "#755088",
        contrastText: "238, 230, 255"},
    },
    typography: {
      fontFamily: "'Comfortaa', cursive",
      allVariants: {
        wordBreak: "break-word",
        textTransform: "none",
      },
    },
    spacing: 4,
    shape: {
      borderRadius: 3, 
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
