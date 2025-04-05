import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTheme, ThemeProvider, CssBaseline, Box, Container, Grid, Button, TextField, Typography, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Stage, Layer, Rect, Text as KonvaText } from 'react-konva';

// Внутреннее состояние (state — состояние) дерева Фенвика
interface FenwickState {
  array: number[];
  BIT: number[];
  highlightedPath: number[];
  viewMode: 'default' | 'binary';
  animationSpeed: number;
  log: string[];
  themeMode: 'light' | 'dark';
}

const initialState: FenwickState = {
  array: new Array(12).fill(0),
  BIT: new Array(12).fill(0),
  highlightedPath: [],
  viewMode: 'default',
  animationSpeed: 500,
  log: [],
  themeMode: 'light',
};

const fenwickSlice = createSlice({
  name: 'fenwick',
  initialState,
  reducers: {
    setArray(state, action: PayloadAction<number[]>) {
      state.array = action.payload;
    },
    buildBIT(state) {
      state.BIT = new Array(12).fill(0);
      for (let i = 1; i < 12; i++) {
        state.BIT[i] = state.array[i];
        const j = i + (i & -i);
        if (j < 12) {
          state.BIT[j] += state.BIT[i];
        }
      }
    },
    update(state, action: PayloadAction<{ index: number; delta: number }>) {
      const { index, delta } = action.payload;
      state.array[index] += delta;
      let i = index;
      state.highlightedPath = [];
      while (i < 12) {
        state.BIT[i] += delta;
        state.highlightedPath.push(i);
        i += i & -i;
      }
      state.log.push(`update(${index}, ${delta}) выполнен`);
    },
    query(state, action: PayloadAction<number>) {
      let index = action.payload;
      let sum = 0;
      state.highlightedPath = [];
      while (index > 0) {
        sum += state.BIT[index];
        state.highlightedPath.push(index);
        index -= index & -index;
      }
      state.log.push(`query(${action.payload}) = ${sum}`);
    },
    rangeSum(state, action: PayloadAction<{ l: number; r: number }>) {
      const { l, r } = action.payload;
      const naiveSum = state.array.slice(l, r + 1).reduce((a, b) => a + b, 0);
      state.log.push(`rangeSum(${l}, ${r}) = ${naiveSum} (наивная сумма)`);
    },
    setAnimationSpeed(state, action: PayloadAction<number>) {
      state.animationSpeed = action.payload;
    },
    clearLog(state) {
      state.log = [];
    },
    setViewMode(state, action: PayloadAction<'default' | 'binary'>) {
      state.viewMode = action.payload;
    },
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
  },
});

const { setArray, buildBIT, update, query, rangeSum, setAnimationSpeed, clearLog, setViewMode, toggleTheme } = fenwickSlice.actions;
const store = configureStore({ reducer: { fenwick: fenwickSlice.reducer } });
type RootState = ReturnType<typeof store.getState>;

// Тип для tooltip
interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  text: string;
}

// Компонент визуализации дерева Фенвика с поддержкой tooltip и зум/пан
const FenwickTreeCanvas: React.FC = () => {
  const CELL_SIZE = 40;
  const highlightedPath = useSelector((state: RootState) => state.fenwick.highlightedPath);
  const BIT = useSelector((state: RootState) => state.fenwick.BIT);
  const viewMode = useSelector((state: RootState) => state.fenwick.viewMode);
  const stageRef = useRef<any>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({ visible: false, x: 0, y: 0, text: '' });

  // Функция для экспорта
  const exportImage = (type: 'png' | 'svg') => {
    if (stageRef.current) {
      if (type === 'png') {
        const dataURL = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = 'fenwick_tree.png';
        link.href = dataURL;
        link.click();
      } else {
        const svg = stageRef.current.toSVG();
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'fenwick_tree.svg';
        link.href = url;
        link.click();
      }
    }
  };

  // Создание ячеек с анимацией при наведении
  const cells = [];
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 12; col++) {
      let fill = 'white';
      if (col >= 1 && col < 12) {
        const low = col - (col & -col);
        const high = col - 1;
        if (row >= low && row <= high) {
          fill = 'black';
        }
        if (highlightedPath.includes(col)) {
          fill = 'blue';
        }
      }
      cells.push(
        <Rect
          key={`${row}-${col}`}
          x={col * CELL_SIZE}
          y={row * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={fill}
          stroke="gray"
          strokeWidth={0.5}
          onMouseEnter={(e) => {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            if (pointer && col >= 1 && col < 12) {
              const index = col;
              const lowbit = index & -index;
              const binary = index.toString(2);
              const low = index - lowbit;
              const high = index - 1;
              setTooltip({
                visible: true,
                x: pointer.x + 10,
                y: pointer.y + 10,
                text: `i: ${index}\nlowbit: ${lowbit}\nбинарное: ${binary}\nпокрытие: [${low}, ${high}]`,
              });
            }
          }}
          onMouseMove={(e) => {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            if (pointer && tooltip.visible) {
              setTooltip((prev) => ({ ...prev, x: pointer.x + 10, y: pointer.y + 10 }));
            }
          }}
          onMouseLeave={() => {
            setTooltip({ visible: false, x: 0, y: 0, text: '' });
          }}
        />
      );
    }
  }

  // Подписи осей X и Y
  const labels = [];
  for (let col = 0; col < 12; col++) {
    labels.push(
      <KonvaText
        key={`x-${col}`}
        x={col * CELL_SIZE + CELL_SIZE / 2 - 5}
        y={12 * CELL_SIZE + 5}
        text={col.toString()}
        fontSize={12}
        fill="black"
      />
    );
  }
  for (let row = 0; row < 12; row++) {
    labels.push(
      <KonvaText
        key={`y-${row}`}
        x={-20}
        y={row * CELL_SIZE + CELL_SIZE / 2 - 6}
        text={row.toString()}
        fontSize={12}
        fill="black"
      />
    );
  }

  // Дополнительная бинарная визуализация под осью X
  const binaryLabels = [];
  if (viewMode === 'binary') {
    for (let col = 1; col < 12; col++) {
      binaryLabels.push(
        <KonvaText
          key={`bin-${col}`}
          x={col * CELL_SIZE + CELL_SIZE / 2 - 10}
          y={12 * CELL_SIZE + 25}
          text={col.toString(2)}
          fontSize={12}
          fill="red"
        />
      );
    }
  }

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <Stage
        ref={stageRef}
        width={12 * CELL_SIZE}
        height={viewMode === 'binary' ? 12 * CELL_SIZE + 50 : 12 * CELL_SIZE + 30}
        draggable
        onWheel={(e) => {
          e.evt.preventDefault();
          const scaleBy = 1.05;
          const stage = e.target.getStage();
          if (stage) {
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            const mousePointTo = {
              x: (pointer.x - stage.x()) / oldScale,
              y: (pointer.y - stage.y()) / oldScale,
            };
            const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
            stage.scale({ x: newScale, y: newScale });
            const newPos = {
              x: pointer.x - mousePointTo.x * newScale,
              y: pointer.y - mousePointTo.y * newScale,
            };
            stage.position(newPos);
            stage.batchDraw();
          }
        }}
      >
        <Layer>
          {cells}
          {labels}
          {binaryLabels}
        </Layer>
      </Stage>
      {tooltip.visible && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: tooltip.y,
            left: tooltip.x,
            padding: 1,
            whiteSpace: 'pre-line',
            pointerEvents: 'none',
          }}
        >
          <Typography variant="caption">{tooltip.text}</Typography>
        </Paper>
      )}
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={() => exportImage('png')}>
          Экспорт PNG
        </Button>
        <Button variant="outlined" onClick={() => exportImage('svg')}>
          Экспорт SVG
        </Button>
      </Box>
    </Box>
  );
};

// Компоненты управления деревом Фенвика
const ArrayInputForm: React.FC = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const arr = input.split(',').map(s => parseInt(s.trim()));
    if (arr.length === 12) {
      dispatch(setArray(arr));
      dispatch(buildBIT());
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Массив (12 чисел, через запятую)"
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

const UpdateForm: React.FC = () => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState('');
  const [delta, setDelta] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const i = parseInt(index);
    const d = parseInt(delta);
    if (!isNaN(i) && !isNaN(d)) {
      dispatch(update({ index: i, delta: d }));
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

const QueryForm: React.FC = () => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const i = parseInt(index);
    if (!isNaN(i)) {
      dispatch(query(i));
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

const AnimationControls: React.FC = () => {
  const dispatch = useDispatch();
  const animationSpeed = useSelector((state: RootState) => state.fenwick.animationSpeed);
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value);
    if (!isNaN(speed)) {
      dispatch(setAnimationSpeed(speed));
    }
  };
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label="Скорость анимации (мс)"
        type="number"
        value={animationSpeed}
        onChange={handleSpeedChange}
        fullWidth
      />
    </Box>
  );
};

const ViewToggles: React.FC = () => {
  const dispatch = useDispatch();
  const viewMode = useSelector((state: RootState) => state.fenwick.viewMode);
  const handleViewChange = (_: any, newView: 'default' | 'binary') => {
    if (newView) {
      dispatch(setViewMode(newView));
    }
  };
  return (
    <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange} sx={{ mb: 2 }}>
      <ToggleButton value="default">Стандартный</ToggleButton>
      <ToggleButton value="binary">Бинарный</ToggleButton>
    </ToggleButtonGroup>
  );
};

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <Button variant="outlined" onClick={() => dispatch(toggleTheme())} sx={{ mb: 2 }}>
      Сменить тему
    </Button>
  );
};

const LogPanel: React.FC = () => {
  const log = useSelector((state: RootState) => state.fenwick.log);
  const dispatch = useDispatch();
  return (
    <Paper sx={{ p: 1, maxHeight: 200, overflowY: 'auto', mb: 2 }}>
      {log.map((entry, idx) => (
        <Typography key={idx} variant="body2">
          {entry}
        </Typography>
      ))}
      <Button onClick={() => dispatch(clearLog())} variant="text" sx={{ mt: 1 }}>
        Очистить лог
      </Button>
    </Paper>
  );
};

const FenwickControls: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Управление Fenwick Tree
      </Typography>
      <ArrayInputForm />
      <UpdateForm />
      <QueryForm />
      <AnimationControls />
      <ViewToggles />
      <ThemeToggle />
      <LogPanel />
    </Box>
  );
};

// Главный компонент, объединяющий всё вместе с поддержкой темы MUI
const FenwickTreeVisualizer: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.fenwick.themeMode);
  const theme = useMemo(() => createTheme({ palette: { mode: themeMode } }), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              <FenwickTreeCanvas />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FenwickControls />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

// Экспорт компонента, обёрнутого в Redux Provider
const FenwickTreeModule: React.FC = () => (
  <Provider store={store}>
    <FenwickTreeVisualizer />
  </Provider>
);

export default FenwickTreeModule;
