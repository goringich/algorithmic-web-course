import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode, GlobalStyles } from '@mui/material';
interface ThemeContextProps {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children : ReactNode }> = ({ children }) => {
  // Save last theme in localStorage 
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('theme');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
  });

  const toggleTheme = () => setMode((prevMode) => {
    const newMode = prevMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newMode);
    return newMode;
  });

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  })

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-initializing');
    root.classList.add(`theme-${mode}`);
  }, [mode]);
  
  

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />  {/* Resetting the default browser styles */}
        <GlobalStyles
          styles={{
            body: {
              fontFamily: 'var(--primary-font)', 
              backgroundColor: 'var(--background-color)', 
              color: mode === 'light' ? '#000000' : '#ffffff', 
              margin: 0, // Сбрасываем отступы браузера
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () : ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context
}
