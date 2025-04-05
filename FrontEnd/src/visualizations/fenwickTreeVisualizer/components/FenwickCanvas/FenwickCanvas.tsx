import React, { useMemo } from 'react';
import { Stage } from 'react-konva';
import BackgroundLayer from './layers/BackgroundLayer';
import TitleLayer from './layers/TitleLayer';
import PowerRowsLayer from './layers/PowerRowsLayer';
import IndexLabelsLayer from './layers/IndexLabelsLayer';
import { useAppSelector } from '../../hooks/reduxHooks';

export interface RangeSegment {
  start: number;
  end: number;
}

export interface PowerRow {
  power: number;
  segments: RangeSegment[];
}

interface FenwickCanvasProps {
  canvasWidth: number;
  canvasHeight: number;
  isBinaryView: boolean;
}

export default function FenwickCanvas({
  canvasWidth,
  canvasHeight,
  isBinaryView,
}: FenwickCanvasProps) {
  const { array, highlightedPath } = useAppSelector((state) => state.fenwick);
  const n = array.length;

  if (
    n <= 0 ||
    !Number.isFinite(canvasWidth) ||
    !Number.isFinite(canvasHeight) ||
    canvasWidth <= 0 ||
    canvasHeight <= 0
  ) {
    return null;
  }

  function getPowersOfTwoUpTo(num: number): number[] {
    const powers: number[] = [];
    let x = 1;
    while (x <= num) x <<= 1;
    x >>= 1;
    while (x > 0) {
      powers.push(x);
      x >>= 1;
    }
    return powers;
  }

  function getSegmentsForPower(p: number, length: number): RangeSegment[] {
    const segments: RangeSegment[] = [];
    for (let start = 1; start <= length; start += p) {
      const end = Math.min(start + p - 1, length);
      segments.push({ start, end });
    }
    return segments;
  }

  const powerRows = useMemo(() => {
    const powers = getPowersOfTwoUpTo(n);
    return powers.map((p) => ({ power: p, segments: getSegmentsForPower(p, n) }));
  }, [n]);

  const scaleX = n > 0 ? canvasWidth / n / 1.1 : 0;
  const rowCount = powerRows.length > 0 ? powerRows.length : 1;
  const rowHeight = canvasHeight / (rowCount + 2);
  const rectHeight = rowHeight * 0.4;

  if (!Number.isFinite(scaleX) || scaleX <= 0 || !Number.isFinite(rowHeight) || rowHeight <= 0) {
    return null;
  }

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <BackgroundLayer width={canvasWidth} height={canvasHeight} />
      <TitleLayer canvasWidth={canvasWidth} />
      <PowerRowsLayer
        powerRows={powerRows}
        rowHeight={rowHeight}
        rectHeight={rectHeight}
        scaleX={scaleX}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        highlightedPath={highlightedPath}
        isBinaryView={isBinaryView}
        totalElements={n}
      />
      <IndexLabelsLayer n={n} scaleX={scaleX} canvasHeight={canvasHeight} />
    </Stage>
  );
}
