import { Layer, Group, Rect, Text } from 'react-konva';
import { PowerRow } from '../FenwickCanvas';

interface Props {
  powerRows: PowerRow[];
  rowHeight: number;
  rectHeight: number;
  scaleX: number;
  canvasHeight: number;
  highlightedPath: number[];
  isBinaryView: boolean;
}

export default function PowerRowsLayer({
  powerRows,
  rowHeight,
  rectHeight,
  scaleX,
  canvasHeight,
  highlightedPath,
  isBinaryView
}: Props) {
  return (
    <Layer>
      {powerRows.map((row, rowIndex) => {
        const yPos = (rowIndex + 1) * rowHeight + 20;
        return (
          <Group key={`row-${row.power}`}>
            <Text
              x={10}
              y={yPos - rectHeight - 10}
              text={`${row.power}`}
              fontSize={16}
              fill="#555"
            />
            {row.segments.map((seg, segIdx) => {
              const segWidth = (seg.end - seg.start + 1) * scaleX;
              const segX = (seg.start - 1) * scaleX;
              const isHighlighted = highlightedPath.some(
                (idx) => idx >= seg.start && idx <= seg.end
              );
              const fillColor = isHighlighted
                ? '#ff9999'
                : isBinaryView
                ? '#fff8e1'
                : '#ffffff';
              return (
                <Group key={`seg-${row.power}-${segIdx}`}>
                  <Rect
                    x={segX}
                    y={yPos - rectHeight}
                    width={segWidth}
                    height={rectHeight}
                    fill={fillColor}
                    stroke="#cc9999"
                    strokeWidth={1}
                    cornerRadius={4}
                  />
                  <Text
                    x={segX + 5}
                    y={yPos - rectHeight + 5}
                    text={`${seg.start}..${seg.end}`}
                    fontSize={12}
                    fill="#333"
                  />
                </Group>
              );
            })}
          </Group>
        );
      })}
    </Layer>
  );
}