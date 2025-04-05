import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { animateRangeSum } from '../../../store/slices/fenwickSlice';

const RangeSumForm: React.FC = () => {
  const dispatch = useDispatch();
  const [l, setL] = useState('');
  const [r, setR] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const left = parseInt(l);
    const right = parseInt(r);
    if (!isNaN(left) && !isNaN(right)) {
      dispatch(animateRangeSum({ l: left, r: right }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Левый индекс (l)"
        value={l}
        onChange={(e) => setL(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Правый индекс (r)"
        value={r}
        onChange={(e) => setR(e.target.value)}
        fullWidth
        required
        sx={{ mt: 1 }}
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Выполнить rangeSum
      </Button>
    </Box>
  );
};

export default RangeSumForm;
