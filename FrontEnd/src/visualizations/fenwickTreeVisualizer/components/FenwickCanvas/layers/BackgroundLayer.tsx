import React from 'react';
import { Layer, Rect } from 'react-konva';

interface BackgroundLayerProps {
  width: number;
  height: number;
}

export default function BackgroundLayer({ width, height }: BackgroundLayerProps) {
  return (
    <Layer>
      <Rect x={0} y={0} width={width} height={height} fill="#f9f2d6" />
    </Layer>
  );
}
