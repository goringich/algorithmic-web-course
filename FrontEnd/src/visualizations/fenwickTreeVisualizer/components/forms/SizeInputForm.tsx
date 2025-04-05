import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSize } from '../../../store/slices/fenwickSlice';
import { RootState } from '../../../store/store';

const SizeInputForm: React.FC = () => {
  const dispatch = useDispatch();
  const size = useSelector((state: RootState) => state.fenwick.size);
  const [input, setInput] = useState(size.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSize = parseInt(input);
    if (!isNaN(newSize) && newSize > 1) {
      dispatch(setSize(newSize));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Размер массива (число > 1)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Применить размер
      </Button>
    </Box>
  );
};

export default SizeInputForm;
