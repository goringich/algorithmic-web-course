import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearLog } from '../../store/slices/fenwickSlice';
import { RootState } from '../../store/store';

const LogPanel: React.FC = () => {
  const log = useSelector((state: RootState) => state.fenwick.log);
  const dispatch = useDispatch();

  return (
    <Paper sx={{ p: 1, maxHeight: 200, overflowY: 'auto', mb: 2 }}>
      {log.map((entry, idx) => (
        <Typography key={idx} variant="body2">
          {entry}
        </Typography>
      ))}
      <Button onClick={() => dispatch(clearLog())} variant="text" sx={{ mt: 1 }}>
        Очистить лог
      </Button>
    </Paper>
  );
};

export default LogPanel;
