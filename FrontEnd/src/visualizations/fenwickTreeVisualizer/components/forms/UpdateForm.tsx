import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { animateUpdate } from '../../../store/slices/fenwickSlice';

const UpdateForm: React.FC = () => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState('');
  const [delta, setDelta] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const i = parseInt(index);
    const d = parseInt(delta);
    if (!isNaN(i) && !isNaN(d)) {
      dispatch(animateUpdate({ index: i, delta: d }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Индекс для обновления"
        value={index}
        onChange={(e) => setIndex(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Изменение (delta)"
        value={delta}
        onChange={(e) => setDelta(e.target.value)}
        fullWidth
        required
        sx={{ mt: 1 }}
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Обновить
      </Button>
    </Box>
  );
};

export default UpdateForm;
