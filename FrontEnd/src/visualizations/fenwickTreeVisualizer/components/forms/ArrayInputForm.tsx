import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setArray, buildBIT } from '../../../store/slices/fenwickSlice';
import { RootState } from '../../../store/store';

const ArrayInputForm: React.FC = () => {
  const dispatch = useDispatch();
  const size = useSelector((state: RootState) => state.fenwick.size);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const arr = input.split(',').map((s) => parseInt(s.trim()));
    if (arr.length === size) {
      dispatch(setArray(arr));
      dispatch(buildBIT());
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label={`Массив (${size} чисел, через запятую)`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        required
        autoFocus
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Применить
      </Button>
    </Box>
  );
};

export default ArrayInputForm;
