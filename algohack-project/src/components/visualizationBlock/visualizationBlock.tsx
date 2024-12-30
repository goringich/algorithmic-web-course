import React, { lazy, Suspense } from 'react';
import Levitate from '../levitate/Levitate';

const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Задержка применяется именно к SegmentTreeVisualizer
const SegmentTreeVisualizer = lazy(() =>
  fakeDelay(3000).then(() => import('../../visualizations/segmentTreeVisualizer/SegmentTreeVisualizer'))
);

const VisualizationBlock = () => {
  return (
    <Suspense fallback={
      <Levitate></Levitate>
    }>
      <SegmentTreeVisualizer />
    </Suspense>
  );
};

export default VisualizationBlock;
