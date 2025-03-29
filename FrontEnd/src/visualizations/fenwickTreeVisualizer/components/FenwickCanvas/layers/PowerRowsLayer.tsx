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
  return (
    <>
      {/* 1. Слой фона и заголовка */}
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

      {/* 2. Слой с рядами (прямоугольники) */}
      <Layer>
        {powerRows.map((row, rowIndex) => {
          // Смещение ряда по вертикали
          const yPos = (rowIndex + 1) * rowHeight + 60;

          return (
            <Group key={`row-${row.power}`}>
              {/* Подпись слева (число power) */}
              <Text
                x={10}
                y={yPos - rectHeight - 20}
                text={`${row.power}`}
                fontSize={16}
                fill="#555"
              />

              {/* Прямоугольники (segments) */}
              {row.segments.map((seg, segIdx) => {
                const length = seg.end - seg.start + 1;
                const segWidth = length * scaleX;
                const segX = (seg.start - 1) * scaleX;

                // Проверка: входит ли в highlightedPath
                const isHighlighted = highlightedPath.some(
                  (idx) => idx >= seg.start && idx <= seg.end
                );

                // Логика выбора цвета заливки
                let fillColor = '#ffffff';
                if (isHighlighted) {
                  fillColor = '#ff9999';
                } else if (length === 1) {
                  // Если ровно 1 элемент, делаем полностью красный
                  fillColor = '#ff0000';
                } else if (isBinaryView) {
                  fillColor = '#fff8e1';
                }

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

      {/* 3. Слой с подписями len, i и индексами внизу */}
      <Layer>
        <Text
          x={5}
          y={canvasHeight - 60}
          text="len"
          fontSize={16}
          fill="#555"
        />
        <Text
          x={5}
          y={canvasHeight - 40}
          text="i"
          fontSize={16}
          fill="#555"
        />
        {Array.from({ length: totalElements }, (_, i) => i + 1).map((i) => {
          // Смещаем x, чтобы было место слева
          const xPos = (i - 1) * scaleX + 30;
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
