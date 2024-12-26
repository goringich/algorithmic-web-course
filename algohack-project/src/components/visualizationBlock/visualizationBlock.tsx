import React, {lazy, Suspense} from 'react';
const SegmentTreeVisualizer = lazy(() =>
  import('../../visualizations/SegmentTreeVisualizer')
);

const VisualizationBlock = () => {
  return (
    <Suspense fallback={
      <div>Loading...</div>
    }>
      <SegmentTreeVisualizer />
    </Suspense>

  );
};

export default VisualizationBlock;
