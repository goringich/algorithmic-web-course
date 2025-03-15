import React from 'react';
import { Paper, Typography } from '@mui/material';

export default function FenwickInfo() {
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        О BIT (Binary Indexed Tree)
      </Typography>
      <Typography variant="body2">
        Binary Indexed Tree (Fenwick Tree) – структура (structure (структура)) данных, которая
        эффективно (efficiently (эффективно)) обрабатывает запросы префиксной суммы и обновления.
      </Typography>
    </Paper>
  );
}
