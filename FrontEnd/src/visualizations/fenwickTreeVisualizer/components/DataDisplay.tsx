import React from 'react';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const DataDisplay: React.FC = () => {
  const array = useSelector((state: RootState) => state.fenwick.array);
  const BIT = useSelector((state: RootState) => state.fenwick.BIT);

  return (
    <Paper sx={{ p: 1, mb: 2 }}>
      <Typography variant="subtitle1">Исходный массив</Typography>
      <Typography variant="body2">{array.slice(1).join(', ')}</Typography>
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        BIT массив
      </Typography>
      <Typography variant="body2">{BIT.slice(1).join(', ')}</Typography>
    </Paper>
  );
};

export default DataDisplay;
