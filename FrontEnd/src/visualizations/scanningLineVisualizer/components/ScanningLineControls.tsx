import React, { useState } from 'react';
import { Box, Button, Slider, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addInterval, setSweepX, animateSweep, setAnimationSpeed, toggleTheme } from '../../store/slices/scanningLineSlice';
import { RootState } from '../../store/store';

const ScanningLineControls: React.FC = () => {
  const dispatch = useDispatch();
  const sweepX = useSelector((state: RootState) => state.scanningLine.sweepX);
  const animationSpeed = useSelector((state: RootState) => state.scanningLine.animationSpeed);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleAdd = () => {
    const s = parseInt(start);
    const e = parseInt(end);
    if (!isNaN(s) && !isNaN(e) && s < e) {
      dispatch(addInterval({start: s, end: e}));
      setStart('');
      setEnd('');
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Сканирующая прямая</Typography>
      <Box display="flex" gap={1}>
        <TextField label="Начало" value={start} onChange={e => setStart(e.target.value)} />
        <TextField label="Конец" value={end} onChange={e => setEnd(e.target.value)} />
        <Button variant="contained" onClick={handleAdd}>Добавить</Button>
      </Box>
      <Typography>Положение прямой: {sweepX}</Typography>
      <Slider min={0} max={20} value={sweepX} onChange={(_,v)=>dispatch(setSweepX(v as number))} />
      <Button variant="contained" onClick={() => dispatch(animateSweep())}>Старт анимации</Button>
      <Slider min={100} max={1000} step={100} value={animationSpeed} onChange={(_,v)=>dispatch(setAnimationSpeed(v as number))} valueLabelDisplay="auto" />
      <Button onClick={()=>dispatch(toggleTheme())}>Сменить тему</Button>
    </Box>
  );
};

export default ScanningLineControls;
