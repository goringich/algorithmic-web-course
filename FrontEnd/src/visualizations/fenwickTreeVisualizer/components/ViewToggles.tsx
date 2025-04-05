import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setViewMode } from '../../store/slices/fenwickSlice';
import { RootState } from '../../store/store';

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

export default ViewToggles;
