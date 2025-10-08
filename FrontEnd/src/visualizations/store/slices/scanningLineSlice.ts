import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Interval { start: number; end: number }

export interface ScanningLineState {
  intervals: Interval[];
  sweepX: number;
  active: number[];
  log: string[];
  animationSpeed: number;
  themeMode: 'light' | 'dark';
}

const initialState: ScanningLineState = {
  intervals: [ {start: 1, end: 5}, {start: 3, end: 8}, {start: 6, end: 9} ],
  sweepX: 0,
  active: [],
  log: [],
  animationSpeed: 500,
  themeMode: 'light',
};

export const animateSweep = createAsyncThunk(
  'scanningLine/animateSweep',
  async (_, { dispatch, getState }) => {
    const state = (getState() as { scanningLine: ScanningLineState }).scanningLine;
    const events: {x:number; type:'start'|'end'; idx:number}[] = [];
    state.intervals.forEach((intv, idx) => {
      events.push({x: intv.start, type:'start', idx});
      events.push({x: intv.end, type:'end', idx});
    });
    events.sort((a,b) => a.x - b.x || (a.type === 'end' ? 1 : -1));
    let sweep = state.sweepX;
    const active: number[] = [...state.active];
    for (const ev of events) {
      while (sweep < ev.x) {
        dispatch(setSweepX(sweep));
        await new Promise(res => setTimeout(res, state.animationSpeed));
        sweep += 1;
      }
      if (ev.type === 'start') {
        active.push(ev.idx);
      } else {
        const i = active.indexOf(ev.idx);
        if (i !== -1) active.splice(i,1);
      }
      dispatch(setActive([...active]));
      dispatch(appendLog(`${ev.type === 'start' ? 'Добавлен' : 'Удалён'} интервал ${ev.idx}`));
    }
    dispatch(setSweepX(sweep));
  }
);

const scanningLineSlice = createSlice({
  name: 'scanningLine',
  initialState,
  reducers: {
    addInterval(state, action: PayloadAction<Interval>) {
      state.intervals.push(action.payload);
    },
    setSweepX(state, action: PayloadAction<number>) {
      state.sweepX = action.payload;
    },
    setActive(state, action: PayloadAction<number[]>) {
      state.active = action.payload;
    },
    appendLog(state, action: PayloadAction<string>) {
      state.log.push(action.payload);
    },
    clearLog(state) {
      state.log = [];
    },
    setAnimationSpeed(state, action: PayloadAction<number>) {
      state.animationSpeed = action.payload;
    },
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
  }
});

export const {
  addInterval,
  setSweepX,
  setActive,
  appendLog,
  clearLog,
  setAnimationSpeed,
  toggleTheme,
} = scanningLineSlice.actions;

export default scanningLineSlice.reducer;
