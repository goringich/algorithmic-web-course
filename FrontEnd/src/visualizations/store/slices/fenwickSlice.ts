import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createFenwickTree, FenwickTree } from '../../fenwickTreeVisualizer/utils/fenwickTree';

interface FenwickState {
  array: number[];
  bit: FenwickTree | null;
  highlightedPath: number[];
  isAnimating: boolean;
  logs: string[];
}

const initialState: FenwickState = {
  array: [3, 5, 7, 9, 11, 13, 15],
  bit: null,
  highlightedPath: [],
  isAnimating: false,
  logs: []
};

const fenwickSlice = createSlice({
  name: 'fenwick',
  initialState,
  reducers: {
    setArray(state, action: PayloadAction<number[]>) {
      state.array = action.payload;
    },
    buildFenwick(state) {
      state.bit = createFenwickTree(state.array);
      state.logs.push(`BIT построен из массива [${state.array.join(', ')}]`);
    },
    setHighlightedPath(state, action: PayloadAction<number[]>) {
      state.highlightedPath = action.payload;
    },
    setIsAnimating(state, action: PayloadAction<boolean>) {
      state.isAnimating = action.payload;
    },
    addLog(state, action: PayloadAction<string>) {
      state.logs.push(action.payload);
    },
    updateValue(
      state,
      action: PayloadAction<{ index: number; newValue: number }>
    ) {
      const { index, newValue } = action.payload;
      if (!state.bit) return;
      const oldVal = state.array[index - 1];
      const diff = newValue - oldVal;
      state.logs.push(
        `Обновляем индекс ${index} с ${oldVal} до ${newValue} (разница: ${
          diff >= 0 ? '+' : ''
        }${diff})`
      );
      const path = state.bit.update(index, diff);
      state.highlightedPath = path;
      state.array[index - 1] = newValue;
    }
  }
});

export const {
  setArray,
  buildFenwick,
  setHighlightedPath,
  setIsAnimating,
  addLog,
  updateValue
} = fenwickSlice.actions;
export default fenwickSlice.reducer;
