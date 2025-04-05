import React from 'react';
import { Layer, Rect, Text, Group, Arrow } from 'react-konva';

interface Props {
  totalElements: number;
  scaleX: number;
  canvasWidth: number;
  canvasHeight: number;
  highlightedPath: number[];
  isBinaryView: boolean;
}

export default function PowerRowsLayer({
  totalElements,
  scaleX,
  canvasWidth,
  canvasHeight,
  highlightedPath,
  isBinaryView,
}: Props) {
  // Group BIT -CHICHING TO THE LEASE OF RASE (I & -I)
  const groups: { [block: number]: number[] } = {};
  for (let i = 1; i <= totalElements; i++) {
    const block = i & -i;
    if (!groups[block]) groups[block] = [];
    groups[block].push(i);
  }
  const uniqueBlocks = Object.keys(groups).map(Number).sort((a, b) => a - b);
  const rowCount = uniqueBlocks.length;
  const rowHeight = canvasHeight / (rowCount + 2);
  const rectHeight = rowHeight * 0.4;

  // Calculation of the range for the BIT-YAN with index I
  const getRangeForIndex = (i: number) => {
    const block = i & -i;
    return { start: i - block + 1, end: i };
  };

  // Calculation of the X-coordinates of the index label (the middle point of the label)
  const getLabelX = (i: number) => (i - 1) * scaleX + 30 + scaleX / 2;

  const cells: {
    i: number;
    block: number;
    x: number;
    width: number;
    y: number;
    range: { start: number; end: number };
  }[] = [];
  uniqueBlocks.forEach((block, rowIndex) => {
    const indices = groups[block];
    indices.forEach((i) => {
      const x = (i - 1) * scaleX;
      const width = scaleX * (i & -i);
      const y = (rowIndex + 1) * rowHeight + 60;
      cells.push({ i, block, x, width, y, range: getRangeForIndex(i) });
    });
  });

  return (
    <>
      {/* Фон и заголовок */}
      <Layer>
        <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="#f9f2d6" />
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

      {/* Отрисовка BIT-ячейки */}
      <Layer>
        {cells.map((cell) => {
          const isHighlighted = highlightedPath.includes(cell.i);
          let fillColor = '#ffffff';
          if (isHighlighted) {
            fillColor = '#ff9999';
          } else if (cell.block === 1) {
            fillColor = '#ff0000';
          } else if (isBinaryView) {
            fillColor = '#fff8e1';
          }
          return (
            <Group key={`cell-${cell.i}`}>
              <Rect
                x={cell.x}
                y={cell.y - rectHeight}
                width={cell.width}
                height={rectHeight}
                fill={fillColor}
                stroke="#cc9999"
                strokeWidth={1}
                cornerRadius={4}
              />
              <Text
                x={cell.x + 5}
                y={cell.y - rectHeight + 5}
                text={`${cell.range.start}..${cell.range.end}`}
                fontSize={12}
                fill="#333"
              />
            </Group>
          );
        })}
      </Layer>

      {/* Arrows from cells to indexes */}
      <Layer>
        {cells.map((cell) => {
          const centerX = cell.x + cell.width / 2;
          const centerY = cell.y - rectHeight / 2;
          const labelX = getLabelX(cell.i);
          const labelY = canvasHeight - 40;
          return (
            <Arrow
              key={`arrow-${cell.i}`}
              points={[centerX, centerY, labelX, labelY]}
              pointerLength={10}
              pointerWidth={10}
              fill="#00aaff"
              stroke="#00aaff"
              strokeWidth={2}
            />
          );
        })}
        {highlightedPath.length > 0 && (
          <Text
            x={10}
            y={canvasHeight - 100}
            text="Operation Animation"
            fontSize={16}
            fill="#aa0000"
          />
        )}
      </Layer>

      {/* Signatures "Len", "I" and index numbers */}
      <Layer>
        <Text x={5} y={canvasHeight - 60} text="len" fontSize={16} fill="#555" />
        <Text x={5} y={canvasHeight - 40} text="i" fontSize={16} fill="#555" />
        {Array.from({ length: totalElements }, (_, i) => i + 1).map((i) => {
          const xPos = (i - 1) * scaleX + 30;
          return (
            <Text
              key={`index-${i}`}
              x={xPos}
              y={canvasHeight - 40}
              text={`${i}`}
              fontSize={14}
              fill="#333"
              width={scaleX}
              align="center"
            />
          );
        })}
      </Layer>
    </>
  );
}
