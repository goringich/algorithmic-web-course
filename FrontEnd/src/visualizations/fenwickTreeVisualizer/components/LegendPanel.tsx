import React from 'react';
import { Paper, Typography } from '@mui/material';

const LegendPanel: React.FC = () => (
  <Paper sx={{ p: 1, mb: 2 }}>
    <Typography variant="subtitle1">Легенда</Typography>
    <Typography variant="body2">
      Белый – пустая ячейка; Черный – область покрытия BIT; Синий – выделенная ячейка; Красный – бинарное представление; Зеленые стрелки – связь между ячейками; Оранжевый (с прозрачностью) – выделенный диапазон для rangeSum.
    </Typography>
  </Paper>
);

export default LegendPanel;
