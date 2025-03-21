// store.ts
import { configureStore } from '@reduxjs/toolkit';
import segmentTreeReducer from './slices/segmentTreeSlice';
import fenwickReducer from './slices/fenwickSlice';

const store = configureStore({
  reducer: {
    segmentTree: segmentTreeReducer,
    fenwick: fenwickReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
