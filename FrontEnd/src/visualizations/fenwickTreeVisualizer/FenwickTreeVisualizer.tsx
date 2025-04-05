import React, { useMemo } from 'react';
import { Provider, useSelector } from 'react-redux';
import { createTheme, ThemeProvider, CssBaseline, Container, Grid, Box } from '@mui/material';
import FenwickTreeCanvas from './components/FenwickTreeCanvas';
import FenwickControls from './components/FenwickControls';
import store, { RootState } from '../store/store';

const FenwickTreeVisualizer: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.fenwick.themeMode);
  const theme = useMemo(() => createTheme({ palette: { mode: themeMode } }), [themeMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              <FenwickTreeCanvas />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FenwickControls />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

const WrappedFenwickTreeVisualizer: React.FC = () => (
  <Provider store={store}>
    <FenwickTreeVisualizer />
  </Provider>
);

export default WrappedFenwickTreeVisualizer;
