import React, { useState } from 'react';
import { Paper, Typography, Button } from '@mui/material';

const GuidedTour: React.FC = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1">Интерактивный тур</Typography>
      <Typography variant="body2">
        Здесь вы можете наблюдать пошаговую работу алгоритма Fenwick Tree. Используйте формы "Обновить", "Запрос" и "rangeSum" для анимации операций.
        Нововведения: на ячейках отображаются значения BIT с градиентной заливкой, добавлены кнопки Zoom In/Out и Reset, а также интерактивная подсветка диапазона при rangeSum.
      </Typography>
      <Button variant="text" onClick={() => setVisible(false)} sx={{ mt: 1 }}>
        Закрыть тур
      </Button>
    </Paper>
  );
};

export default GuidedTour;
