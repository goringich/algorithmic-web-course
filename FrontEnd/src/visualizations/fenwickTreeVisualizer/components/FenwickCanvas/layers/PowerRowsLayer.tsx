import React from 'react';
import { Layer, Rect, Text, Group } from 'react-konva';

export interface Segment {
  start: number;
  end: number;
}

export interface PowerRow {
  power: number;
  segments: Segment[];
}

interface Props {
  powerRows: PowerRow[];
  rowHeight: number;
  rectHeight: number;
  scaleX: number;
  canvasWidth: number;
  canvasHeight: number;
  highlightedPath: number[];
  isBinaryView: boolean;
  totalElements: number;
}

export default function PowerRowsLayer({
  powerRows,
  rowHeight,
  rectHeight,
  scaleX,
  canvasWidth,
  canvasHeight,
  highlightedPath,
  isBinaryView,
  totalElements
}: Props) {
  // Промежутки по вертикали между рядами и отступ сверху
  const rowSpacing = 150;
  const topOffset = 50;

  // Ширина (width) узкой красной полосы справа
  const highlightPortion = 50;

  return (
    <>
      {/* Слой фона и заголовка */}
      <Layer>
        <Rect
          x={0}
          y={0}
          width={canvasWidth}
          height={canvasHeight}
          fill="#f9f2d6"
        />
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

      {/* Слой с рядами */}
      <Layer>
        {powerRows.map((row, rowIndex) => {
          // Вертикальное положение ряда
          const yPos = topOffset + rowIndex * rowSpacing;

          return (
            <Group key={`row-${row.power}`}>
              {/* Подпись степени (power) слева */}
              <Text
                x={10}
                y={yPos}
                text={`${row.power}`}
                fontSize={16}
                fill="#555"
              />

              {row.segments.map((seg, segIdx) => {
                const segWidth = (seg.end - seg.start + 1) * scaleX;
                // Немного смещаем прямоугольники вправо, чтобы освободить место для подписи power
                const segX = (seg.start - 1) * scaleX + 80;

                // Проверка, нужно ли подсветить сегмент
                const isHighlighted = highlightedPath.some(
                  (idx) => idx >= seg.start && idx <= seg.end
                );

                // Цвет основной части
                const baseFill = isHighlighted
                  ? '#ff9999'
                  : isBinaryView
                  ? '#fff8e1'
                  : '#ffffff';

                return (
                  <Group key={`seg-${row.power}-${segIdx}`}>
                    {/* Основная белая/подсвеченная часть */}
                    <Rect
                      x={segX}
                      y={yPos}
                      width={segWidth}
                      height={rectHeight}
                      fill={baseFill}
                      stroke="#cc9999"
                      strokeWidth={1}
                      cornerRadius={4}
                    />
                    {/* Узкая красная полоса справа */}
                    <Rect
                      x={segX + segWidth - highlightPortion}
                      y={yPos}
                      width={highlightPortion}
                      height={rectHeight}
                      fill="#ff9999"
                      cornerRadius={4}
                    />
                    {/* Подпись внутри прямоугольника (start..end) */}
                    <Text
                      x={segX + 5}
                      y={yPos + 5}
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

      {/* Слой с "len", "i" и индексами внизу */}
      <Layer>
        <Text
          x={10}
          y={canvasHeight - 60}
          text="len"
          fontSize={16}
          fill="#555"
        />
        <Text
          x={10}
          y={canvasHeight - 40}
          text="i"
          fontSize={16}
          fill="#555"
        />
        {Array.from({ length: totalElements }, (_, i) => i + 1).map((i) => {
          // Смещаем индексы вправо, как и прямоугольники
          const xPos = (i - 1) * scaleX + 80;
          return (
            <Text
              key={`index-${i}`}
              x={xPos + 2}
              y={canvasHeight - 40}
              text={`${i}`}
              fontSize={14}
              fill="#333"
            />
          );
        })}
      </Layer>
    </>
  );
}
