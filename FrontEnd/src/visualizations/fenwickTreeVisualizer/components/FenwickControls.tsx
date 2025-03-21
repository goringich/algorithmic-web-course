import React, { useState } from 'react';
import { Paper, Box, TextField, Button, Slider, Typography, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  setArray,
  buildFenwick,
  addLog,
  updateValue,
  setIsAnimating,
  setHighlightedPath 
} from '../../store/slices/fenwickSlice';

interface FenwickControlsProps {
  updateIndex: number;
  setUpdateIndex: React.Dispatch<React.SetStateAction<number>>;
  updateVal: number;
  setUpdateVal: React.Dispatch<React.SetStateAction<number>>;
  queryLeft: number;
  setQueryLeft: React.Dispatch<React.SetStateAction<number>>;
  queryRight: number;
  setQueryRight: React.Dispatch<React.SetStateAction<number>>;
  animationSpeed: number;
  setAnimationSpeed: React.Dispatch<React.SetStateAction<number>>;
  isBinaryView: boolean;
  toggleView: () => void;
}

export default function FenwickControls({
  updateIndex,
  setUpdateIndex,
  updateVal,
  setUpdateVal,
  queryLeft,
  setQueryLeft,
  queryRight,
  setQueryRight,
  animationSpeed,
  setAnimationSpeed,
  isBinaryView,
  toggleView
}: FenwickControlsProps) {
  const [localArrayInput, setLocalArrayInput] = useState('[3,5,7,9,11,13,15]');
  const dispatch = useAppDispatch();
  const fenwState = useAppSelector((state) => state.fenwick) || { array: [], isAnimating: false };

  const applyArray = () => {
    try {
      const parsed = JSON.parse(localArrayInput);
      if (!Array.isArray(parsed)) {
        throw new Error('Не массив');
      }
      const numericArr = parsed.map(Number);
      if (numericArr.some(isNaN)) {
        throw new Error('Содержит нечисловые значения');
      }
      dispatch(setArray(numericArr));
      dispatch(buildFenwick());
      dispatch(addLog(`Массив обновлён: [${numericArr.join(', ')}]`));
    } catch (error: any) {
      dispatch(addLog(`Ошибка: ${error.message}`));
    }
  };

  const handleUpdate = () => {
    if (fenwState.isAnimating) return;
    if (updateIndex < 1 || updateIndex > fenwState.array.length) return;
    dispatch(setIsAnimating(true));
    dispatch(updateValue({ index: updateIndex, newValue: updateVal }));
    setTimeout(() => {
      dispatch(setHighlightedPath([]));
      dispatch(setIsAnimating(false));
    }, 1500 / animationSpeed);
  };

  const handlePrefixSum = () => {
    if (!fenwState.bit || fenwState.isAnimating) return;
    if (queryRight < 1 || queryRight > fenwState.array.length) return;
    dispatch(setIsAnimating(true));
    dispatch(addLog(`Префиксная сумма [1..${queryRight}]`));
    const { sum, path } = fenwState.bit.prefixSum(queryRight);
    dispatch(setHighlightedPath(path));
    setTimeout(() => {
      dispatch(addLog(`Сумма: ${sum}`));
      setTimeout(() => {
        dispatch(setHighlightedPath([]));
        dispatch(setIsAnimating(false));
      }, 1000 / animationSpeed);
    }, 1500 / animationSpeed);
  };

  const handleRangeSum = () => {
    if (!fenwState.bit || fenwState.isAnimating) return;
    if (queryLeft < 1 || queryRight > fenwState.array.length || queryLeft > queryRight) return;
    dispatch(setIsAnimating(true));
    dispatch(addLog(`Диапазонная сумма [${queryLeft}..${queryRight}]`));
    const { sum, rightPath, leftPath } = fenwState.bit.rangeSum(queryLeft, queryRight);
    dispatch(setHighlightedPath(rightPath));
    setTimeout(() => {
      if (leftPath.length > 0) {
        dispatch(setHighlightedPath(leftPath));
        setTimeout(() => {
          dispatch(addLog(`Сумма: ${sum}`));
          dispatch(setHighlightedPath([]));
          dispatch(setIsAnimating(false));
        }, 1000 / animationSpeed);
      } else {
        dispatch(addLog(`Сумма: ${sum}`));
        setTimeout(() => {
          dispatch(setHighlightedPath([]));
          dispatch(setIsAnimating(false));
        }, 1000 / animationSpeed);
      }
    }, 1500 / animationSpeed);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Управление (Controls (управление))
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Array Input (Ввод массива)"
          value={localArrayInput}
          onChange={(e) => setLocalArrayInput(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button variant="contained" sx={{ mt: 1 }} onClick={applyArray}>
          Обновить массив
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Index (Индекс)"
            type="number"
            value={updateIndex}
            onChange={(e) =>
              setUpdateIndex(
                Math.min(
                  fenwState.array.length,
                  Math.max(1, parseInt(e.target.value) || 1)
                )
              )
            }
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Value (Значение)"
            type="number"
            value={updateVal}
            onChange={(e) => setUpdateVal(parseInt(e.target.value) || 0)}
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mb: 2 }}
        onClick={handleUpdate}
        disabled={fenwState.isAnimating}
      >
        Обновить (Update (обновить))
      </Button>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Left (Левый)"
            type="number"
            value={queryLeft}
            onChange={(e) =>
              setQueryLeft(
                Math.min(
                  fenwState.array.length,
                  Math.max(1, parseInt(e.target.value) || 1)
                )
              )
            }
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Right (Правый)"
            type="number"
            value={queryRight}
            onChange={(e) =>
              setQueryRight(
                Math.min(
                  fenwState.array.length,
                  Math.max(1, parseInt(e.target.value) || 1)
                )
              )
            }
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        fullWidth
        sx={{ mb: 2 }}
        onClick={handleRangeSum}
        disabled={fenwState.isAnimating}
      >
        Диапазонная сумма (Range Sum (диапазонная сумма))
      </Button>

      <Button
        variant="contained"
        fullWidth
        sx={{ mb: 2 }}
        onClick={handlePrefixSum}
        disabled={fenwState.isAnimating}
      >
        Префиксная сумма (Prefix Sum (префиксная сумма))
      </Button>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>
          Скорость анимации (Animation Speed (скорость анимации))
        </Typography>
        <Slider
          value={animationSpeed}
          min={0.5}
          max={3}
          step={0.5}
          onChange={(e, val) => setAnimationSpeed(val as number)}
          valueLabelDisplay="auto"
        />
      </Box>

      <Button variant="contained" fullWidth onClick={toggleView}>
        {isBinaryView
          ? 'Показать стандартный вид (Show Standard View (стандартный вид))'
          : 'Показать бинарный вид (Show Binary View (двоичный вид))'}
      </Button>
    </Paper>
  );
}
