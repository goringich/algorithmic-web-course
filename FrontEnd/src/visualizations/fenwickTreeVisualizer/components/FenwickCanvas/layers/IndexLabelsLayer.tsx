import React from 'react';
import { Layer, Group, Text } from 'react-konva';

interface Props {
  n: number;
  scaleX: number;
  canvasHeight: number;
}

export default function IndexLabelsLayer({ n, scaleX, canvasHeight }: Props) {
  return (
    <Layer>
      <Group>
        <Text
          x={5}
          y={canvasHeight - 60}
          text="len"
          fontSize={14}
          fill="#555"
        />
        <Text
          x={5}
          y={canvasHeight - 40}
          text="i"
          fontSize={14}
          fill="#555"
        />
        {Array.from({ length: n }, (_, i) => i + 1).map((idx) => {
          const xPos = (idx - 1) * scaleX + 30;
          return (
            <Text
              key={`idx-label-${idx}`}
              x={xPos}
              y={canvasHeight - 40}
              text={`${idx}`}
              fontSize={12}
              fill="#333"
              width={scaleX}
              align="center"
            />
          );
        })}
      </Group>
    </Layer>
  );
}
