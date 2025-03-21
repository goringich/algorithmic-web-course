import { Layer, Text } from 'react-konva';

export default function TitleLayer({ canvasWidth }: { canvasWidth: number }) {
  return (
    <Layer>
      <Text
        x={canvasWidth / 2 - 100}
        y={10}
        text="Binary Indexed Tree Ranges"
        fontSize={18}
        fill="#555"
        width={200}
        align="center"
      />
    </Layer>
  );
}
