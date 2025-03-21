import { Layer, Rect } from 'react-konva';

export default function BackgroundLayer({ width, height }: { width: number; height: number }) {
  return (
    <Layer>
      <Rect x={0} y={0} width={width} height={height} fill="#f9f4d9" />
    </Layer>
  );
}
