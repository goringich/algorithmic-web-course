import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface FenwickState {
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
  themeMode: 'light',
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
    },
  },
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
  clearHighlightedRange,
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

export default fenwickSlice.reducer;
