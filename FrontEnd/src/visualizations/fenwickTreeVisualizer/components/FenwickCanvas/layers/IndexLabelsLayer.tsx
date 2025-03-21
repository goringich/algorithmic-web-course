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
        {Array.from({ length: n }, (_, i) => i + 1).map((idx) => {
          const xPos = (idx - 1) * scaleX + scaleX / 2;
          return (
            <Text
              key={`idx-label-${idx}`}
              x={xPos - 5}
              y={canvasHeight - 20}
              text={`${idx}`}
              fontSize={12}
              fill="#333"
              width={10}
              align="center"
            />
          );
        })}
        <Text x={10} y={canvasHeight - 40} text="i" fontSize={14} fill="#555" />
      </Group>
    </Layer>
  );
}
