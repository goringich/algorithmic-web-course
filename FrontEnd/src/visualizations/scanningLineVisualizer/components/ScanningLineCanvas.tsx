import React from 'react';
import { Stage, Layer, Line, Rect, Text as KonvaText } from 'react-konva';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const ScanningLineCanvas: React.FC = () => {
  const intervals = useSelector((state: RootState) => state.scanningLine.intervals);
  const sweepX = useSelector((state: RootState) => state.scanningLine.sweepX);
  const active = useSelector((state: RootState) => state.scanningLine.active);

  const width = 600;
  const height = intervals.length * 30 + 40;

  return (
    <Stage width={width} height={height}>
      <Layer>
        {intervals.map((intv, idx) => (
          <Rect
            key={idx}
            x={intv.start * 40}
            y={idx * 30 + 10}
            width={(intv.end - intv.start) * 40}
            height={20}
            fill={active.includes(idx) ? 'orange' : '#1976d2'}
            opacity={0.6}
          />
        ))}
        <Line points={[sweepX * 40, 0, sweepX * 40, height]} stroke="red" strokeWidth={2} />
        {intervals.map((_, idx) => (
          <KonvaText key={`label-${idx}`} text={String(idx)} x={5} y={idx * 30 + 10} fontSize={14} />
        ))}
      </Layer>
    </Stage>
  );
};

export default ScanningLineCanvas;
