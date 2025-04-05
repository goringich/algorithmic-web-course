import React, { useState, useMemo, useRef } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  configureStore,
  createSlice,
  PayloadAction,
  createAsyncThunk
} from '@reduxjs/toolkit';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Grid,
  Button,
  TextField,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@mui/material';
import { Stage, Layer, Rect, Text as KonvaText, Arrow } from 'react-konva';

interface FenwickState {
  size: number;
  array: number[];
  BIT: number[];
  highlightedPath: number[];
  highlightedRange: { l: number; r: number } | null;
  viewMode: 'default' | 'binary';
  animationSpeed: number;
  log: string[];
  themeMode: 'light' | 'dark';
}

const initialSize = 12;
const initialState: FenwickState = {
  size: initialSize,
  array: new Array(initialSize).fill(0),
  BIT: new Array(initialSize).fill(0),
  highlightedPath: [],
  highlightedRange: null,
  viewMode: 'default',
  animationSpeed: 500,
  log: [],
  themeMode: 'light'
};

const fenwickSlice = createSlice({
  name: 'fenwick',
  initialState,
  reducers: {
    setSize(state, action: PayloadAction<number>) {
      state.size = action.payload;
      state.array = new Array(action.payload).fill(0);
      state.BIT = new Array(action.payload).fill(0);
    },
    setArray(state, action: PayloadAction<number[]>) {
      state.array = action.payload;
    },
    buildBIT(state) {
      state.BIT = new Array(state.size).fill(0);
      for (let i = 1; i < state.size; i++) {
        state.BIT[i] = state.array[i];
        const j = i + (i & -i);
        if (j < state.size) {
          state.BIT[j] += state.BIT[i];
        }
      }
    },
    updateArrayElement(state, action: PayloadAction<{ index: number; delta: number }>) {
      state.array[action.payload.index] += action.payload.delta;
    },
    updateBITElement(state, action: PayloadAction<{ index: number; delta: number }>) {
      state.BIT[action.payload.index] += action.payload.delta;
    },
    setHighlightedPath(state, action: PayloadAction<number[]>) {
      state.highlightedPath = action.payload;
    },
    appendLog(state, action: PayloadAction<string>) {
      state.log.push(action.payload);
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
    setHighlightedRange(state, action: PayloadAction<{ l: number; r: number }>) {
      state.highlightedRange = action.payload;
    },
    clearHighlightedRange(state) {
      state.highlightedRange = null;
    }
  }
});

export const {
  setSize,
  setArray,
  buildBIT,
  updateArrayElement,
  updateBITElement,
  setHighlightedPath,
  appendLog,
  setAnimationSpeed,
  clearLog,
  setViewMode,
  toggleTheme,
  setHighlightedRange,
  clearHighlightedRange
} = fenwickSlice.actions;

export const animateUpdate = createAsyncThunk(
  'fenwick/animateUpdate',
  async ({ index, delta }: { index: number; delta: number }, { dispatch, getState }) => {
    const state = (getState() as { fenwick: FenwickState }).fenwick;
    dispatch(updateArrayElement({ index, delta }));
    let i = index;
    while (i < state.size) {
      await new Promise((resolve) => setTimeout(resolve, state.animationSpeed));
      dispatch(updateBITElement({ index: i, delta }));
      dispatch(setHighlightedPath([i]));
      i += i & -i;
    }
    dispatch(appendLog(`update(${index}, ${delta}) выполнен`));
  }
);

export const animateQuery = createAsyncThunk(
  'fenwick/animateQuery',
  async (index: number, { dispatch, getState }) => {
    const state = (getState() as { fenwick: FenwickState }).fenwick;
    let i = index;
    let sum = 0;
    const path: number[] = [];
    while (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, state.animationSpeed));
      sum += state.BIT[i];
      path.push(i);
      dispatch(setHighlightedPath([...path]));
      i -= i & -i;
    }
    dispatch(appendLog(`query(${index}) = ${sum}`));
  }
);

export const animateRangeSum = createAsyncThunk(
  'fenwick/animateRangeSum',
  async ({ l, r }: { l: number; r: number }, { dispatch, getState }) => {
    const state = (getState() as { fenwick: FenwickState }).fenwick;
    dispatch(setHighlightedRange({ l, r }));
    await new Promise((resolve) => setTimeout(resolve, state.animationSpeed));
    const naiveSum = state.array.slice(l, r + 1).reduce((a, b) => a + b, 0);
    dispatch(appendLog(`rangeSum(${l}, ${r}) = ${naiveSum} (наивная сумма)`));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch(clearHighlightedRange());
  }
);

const store = configureStore({ reducer: { fenwick: fenwickSlice.reducer } });
type RootState = ReturnType<typeof store.getState>;

const FenwickTreeCanvas: React.FC = () => {
  const CELL_SIZE = 40;
  const highlightedPath = useSelector((state: RootState) => state.fenwick.highlightedPath);
  const highlightedRange = useSelector((state: RootState) => state.fenwick.highlightedRange);
  const BIT = useSelector((state: RootState) => state.fenwick.BIT);
  const viewMode = useSelector((state: RootState) => state.fenwick.viewMode);
  const size = useSelector((state: RootState) => state.fenwick.size);
  const stageRef = useRef<any>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; text: string }>({
    visible: false,
    x: 0,
    y: 0,
    text: ''
  });
  const gridSize = size;

  const zoomIn = () => {
    if (stageRef.current) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const newScale = oldScale * 1.2;
      stage.scale({ x: newScale, y: newScale });
      stage.batchDraw();
    }
  };

  const zoomOut = () => {
    if (stageRef.current) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const newScale = oldScale / 1.2;
      stage.scale({ x: newScale, y: newScale });
      stage.batchDraw();
    }
  };

  const resetTransform = () => {
    if (stageRef.current) {
      const stage = stageRef.current;
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
    }
  };

  const cells = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      let cellProps: any = {
        key: `${row}-${col}`,
        x: col * CELL_SIZE,
        y: row * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
        stroke: 'gray',
        strokeWidth: 0.5,
        fill: 'white'
      };
      if (col >= 1 && col < gridSize) {
        const low = col - (col & -col);
        const high = col - 1;
        if (row >= low && row <= high) {
          const centerRow = Math.floor((low + high) / 2);
          cellProps.fill = row === centerRow ? 'blue' : 'black';
        }
        if (highlightedPath.includes(col)) {
          cellProps.fill = 'blue';
        }
      }
      
      cells.push(
        <Rect
          {...cellProps}
          onMouseEnter={(e) => {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            if (pointer && col >= 1 && col < gridSize) {
              const index = col;
              const lowbit = index & -index;
              const binary = index.toString(2);
              const low = index - lowbit;
              const high = index - 1;
              setTooltip({
                visible: true,
                x: pointer.x + 10,
                y: pointer.y + 10,
                text: `i: ${index}\nlowbit: ${lowbit}\nбинарное: ${binary}\nпокрытие: [${low}, ${high}]`
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

  const rangeHighlights = [];
  if (highlightedRange) {
    for (let col = highlightedRange.l; col <= highlightedRange.r; col++) {
      rangeHighlights.push(
        <Rect
          key={`range-${col}`}
          x={col * CELL_SIZE}
          y={0}
          width={CELL_SIZE}
          height={gridSize * CELL_SIZE}
          fill="orange"
          opacity={0.3}
        />
      );
    }
  }

  const labels = [];
  for (let col = 0; col < gridSize; col++) {
    labels.push(
      <KonvaText
        key={`x-${col}`}
        x={col * CELL_SIZE + CELL_SIZE / 2 - 5}
        y={gridSize * CELL_SIZE + 5}
        text={col.toString()}
        fontSize={12}
        fill="black"
      />
    );
  }
  for (let row = 0; row < gridSize; row++) {
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

  const binaryLabels = [];
  if (viewMode === 'binary') {
    for (let col = 1; col < gridSize; col++) {
      binaryLabels.push(
        <KonvaText
          key={`bin-${col}`}
          x={col * CELL_SIZE + CELL_SIZE / 2 - 10}
          y={gridSize * CELL_SIZE + 25}
          text={col.toString(2)}
          fontSize={12}
          fill="red"
        />
      );
    }
  }

  const arrows = [];
  for (let i = 1; i < gridSize; i++) {
    const j = i + (i & -i);
    if (j < gridSize) {
      const lowI = i - (i & -i);
      const highI = i - 1;
      const centerY_i = ((lowI + highI) / 2) * CELL_SIZE + CELL_SIZE / 2;
      const centerX_i = i * CELL_SIZE + CELL_SIZE / 2;
      const lowJ = j - (j & -j);
      const highJ = j - 1;
      const centerY_j = ((lowJ + highJ) / 2) * CELL_SIZE + CELL_SIZE / 2;
      const centerX_j = j * CELL_SIZE + CELL_SIZE / 2;
      arrows.push(
        <Arrow
          key={`arrow-${i}`}
          points={[centerX_i, centerY_i, centerX_j, centerY_j]}
          pointerWidth={4}
          pointerLength={6}
          fill="green"
          stroke="green"
          strokeWidth={2}
        />
      );
    }
  }

  const bitTexts = [];
  for (let i = 1; i < gridSize; i++) {
    const low = i - (i & -i);
    const high = i - 1;
    const centerRow = Math.floor((low + high) / 2);
    bitTexts.push(
      <KonvaText
        key={`bitText-${i}`}
        x={i * CELL_SIZE + CELL_SIZE / 2 - 10}
        y={centerRow * CELL_SIZE + CELL_SIZE / 2 - 10}
        text={BIT[i].toString()}
        fontSize={14}
        fill="black"
      />
    );
  }

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

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <Stage
        ref={stageRef}
        width={gridSize * CELL_SIZE}
        height={viewMode === 'binary' ? gridSize * CELL_SIZE + 50 : gridSize * CELL_SIZE + 30}
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
              y: (pointer.y - stage.y()) / oldScale
            };
            const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
            stage.scale({ x: newScale, y: newScale });
            const newPos = {
              x: pointer.x - mousePointTo.x * newScale,
              y: pointer.y - mousePointTo.y * newScale
            };
            stage.position(newPos);
            stage.batchDraw();
          }
        }}
      >
        <Layer>
          {cells}
          {rangeHighlights}
          {arrows}
          {labels}
          {binaryLabels}
          {bitTexts}
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
            pointerEvents: 'none'
          }}
        >
          <Typography variant="caption">{tooltip.text}</Typography>
        </Paper>
      )}
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Tooltip title="Экспортировать изображение в формате PNG">
          <Button variant="outlined" onClick={() => exportImage('png')}>
            Экспорт PNG
          </Button>
        </Tooltip>
        <Tooltip title="Экспортировать изображение в формате SVG">
          <Button variant="outlined" onClick={() => exportImage('svg')}>
            Экспорт SVG
          </Button>
        </Tooltip>
      </Box>
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={zoomIn}>
          Zoom In
        </Button>
        <Button variant="outlined" onClick={zoomOut}>
          Zoom Out
        </Button>
        <Button variant="outlined" onClick={resetTransform}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

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

const RangeSumForm: React.FC = () => {
  const dispatch = useDispatch();
  const [l, setL] = useState('');
  const [r, setR] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const left = parseInt(l);
    const right = parseInt(r);
    if (!isNaN(left) && !isNaN(right)) {
      dispatch(animateRangeSum({ l: left, r: right }));
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Левый индекс (l)"
        value={l}
        onChange={(e) => setL(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Правый индекс (r)"
        value={r}
        onChange={(e) => setR(e.target.value)}
        fullWidth
        required
        sx={{ mt: 1 }}
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Выполнить rangeSum
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

const DataDisplay: React.FC = () => {
  const array = useSelector((state: RootState) => state.fenwick.array);
  const BIT = useSelector((state: RootState) => state.fenwick.BIT);
  return (
    <Paper sx={{ p: 1, mb: 2 }}>
      <Typography variant="subtitle1">Исходный массив</Typography>
      <Typography variant="body2">{array.slice(1).join(', ')}</Typography>
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        BIT массив
      </Typography>
      <Typography variant="body2">{BIT.slice(1).join(', ')}</Typography>
    </Paper>
  );
};

const LegendPanel: React.FC = () => (
  <Paper sx={{ p: 1, mb: 2 }}>
    <Typography variant="subtitle1">Легенда</Typography>
    <Typography variant="body2">
      Белый – пустая ячейка; Черный – область покрытия BIT; Синий – выделенная ячейка; Красный – бинарное представление; Зеленые стрелки – связь между ячейками; Оранжевый (с прозрачностью) – выделенный диапазон для rangeSum.
    </Typography>
  </Paper>
);

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

const FenwickControls: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Управление Fenwick Tree
      </Typography>
      <GuidedTour />
      <SizeInputForm />
      <ArrayInputForm />
      <UpdateForm />
      <QueryForm />
      <RangeSumForm />
      <AnimationControls />
      <ViewToggles />
      <ThemeToggle />
      <DataDisplay />
      <LegendPanel />
      <LogPanel />
    </Box>
  );
};

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

const FenwickTreeModule: React.FC = () => (
  <Provider store={store}>
    <FenwickTreeVisualizer />
  </Provider>
);

export default FenwickTreeModule;
