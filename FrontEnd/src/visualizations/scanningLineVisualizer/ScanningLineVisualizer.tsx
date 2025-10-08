import React, { useMemo } from 'react';
import { Provider, useSelector } from 'react-redux';
import { createTheme, ThemeProvider, CssBaseline, Container, Grid, Box } from '@mui/material';
import ScanningLineCanvas from './components/ScanningLineCanvas';
import ScanningLineControls from './components/ScanningLineControls';
import store, { RootState } from '../store/store';

const ScanningLineVisualizerInner: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.scanningLine.themeMode);
  const theme = useMemo(() => createTheme({ palette: { mode: themeMode } }), [themeMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 2, height: 'calc(100vh - 16px)', marginBottom: '64px' }}>
        <Grid container spacing={2} sx={{ height: '100%', maxHeight: '650px', minHeight: '650px' }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', height: '100%' }}>
              <ScanningLineCanvas />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: '100%', overflow: 'hidden' }}>
              <ScanningLineControls />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

const ScanningLineVisualizer: React.FC = () => (
  <Provider store={store}>
    <ScanningLineVisualizerInner />
  </Provider>
);

export default ScanningLineVisualizer;
