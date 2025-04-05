import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { animateQuery } from '../../../store/slices/fenwickSlice';

const QueryForm: React.FC = () => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const i = parseInt(index);
    if (!isNaN(i)) {
      dispatch(animateQuery(i));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Индекс для запроса"
        value={index}
        onChange={(e) => setIndex(e.target.value)}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Запрос
      </Button>
    </Box>
  );
};

export default QueryForm;
