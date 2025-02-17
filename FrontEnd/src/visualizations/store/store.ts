import { configureStore } from '@reduxjs/toolkit';
import segmentTreeReducer from './segmentTreeSlice';

const store = configureStore({
  reducer: {
    segmentTree: segmentTreeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
