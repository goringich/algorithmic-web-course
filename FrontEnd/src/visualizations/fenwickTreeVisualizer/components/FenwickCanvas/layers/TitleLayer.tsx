import React from 'react';
import { Layer, Text } from 'react-konva';

interface TitleLayerProps {
  canvasWidth: number;
}

export default function TitleLayer({ canvasWidth }: TitleLayerProps) {
  return (
    <Layer>
      <Text
        x={0}
        y={10}
        width={canvasWidth}
        align="center"
        text="Binary Indexed Tree Ranges"
        fontSize={30}
        fill="#555"
      />
    </Layer>
  );
}
