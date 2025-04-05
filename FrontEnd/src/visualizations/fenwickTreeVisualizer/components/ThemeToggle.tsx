import React from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/slices/fenwickSlice';

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <Button variant="outlined" onClick={() => dispatch(toggleTheme())} sx={{ mb: 2 }}>
      Сменить тему
    </Button>
  );
};

export default ThemeToggle;
