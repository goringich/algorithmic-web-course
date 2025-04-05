import React from 'react';
import { Box, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setAnimationSpeed } from '../../store/slices/fenwickSlice';
import { RootState } from '../../store/store';

const AnimationControls: React.FC = () => {
  const dispatch = useDispatch();
  const animationSpeed = useSelector((state: RootState) => state.fenwick.animationSpeed);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value);
    if (!isNaN(speed)) {
      dispatch(setAnimationSpeed(speed));
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label="Скорость анимации (мс)"
        type="number"
        value={animationSpeed}
        onChange={handleSpeedChange}
        fullWidth
      />
    </Box>
  );
};

export default AnimationControls;
