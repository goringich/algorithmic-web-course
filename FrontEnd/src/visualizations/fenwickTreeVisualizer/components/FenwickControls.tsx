import React from 'react';
import { Box, Typography } from '@mui/material';
import GuidedTour from './GuidedTour';
import SizeInputForm from './forms/SizeInputForm';
import ArrayInputForm from './forms/ArrayInputForm';
import UpdateForm from './forms/UpdateForm';
import QueryForm from './forms/QueryForm';
import RangeSumForm from './forms/RangeSumForm';
import AnimationControls from './AnimationControls';
import ViewToggles from './ViewToggles';
import ThemeToggle from './ThemeToggle';
import DataDisplay from './DataDisplay';
import LegendPanel from './LegendPanel';
import LogPanel from './LogPanel';

const FenwickControls: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Управление Fenwick Tree
      </Typography>
      <GuidedTour />
      <SizeInputForm />
      <ArrayInputForm />
      <UpdateForm />
      <QueryForm />
      <RangeSumForm />
      <AnimationControls />
      <ViewToggles />
      <ThemeToggle />
      <DataDisplay />
      <LegendPanel />
      <LogPanel />
    </Box>
  );
};

export default FenwickControls;
