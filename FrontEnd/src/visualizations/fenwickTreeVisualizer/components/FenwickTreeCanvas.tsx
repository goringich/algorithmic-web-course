import React, { useState, useRef } from 'react';
import { Box, Paper, Typography, Button, Tooltip } from '@mui/material';
import { Stage, Layer, Rect, Text as KonvaText, Arrow } from 'react-konva';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const FenwickTreeCanvas: React.FC = () => {
  const CELL_SIZE = 40;
  const highlightedPath = useSelector((state: RootState) => state.fenwick.highlightedPath);
  const highlightedRange = useSelector((state: RootState) => state.fenwick.highlightedRange);
  const BIT = useSelector((state: RootState) => state.fenwick.BIT);
  const viewMode = useSelector((state: RootState) => state.fenwick.viewMode);
  const size = useSelector((state: RootState) => state.fenwick.size);
  const stageRef = useRef<any>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; text: string }>({
    visible: false,
    x: 0,
    y: 0,
    text: ''
  });
  const gridSize = size;

  const zoomIn = () => {
    if (stageRef.current) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const newScale = oldScale * 1.2;
      stage.scale({ x: newScale, y: newScale });
      stage.batchDraw();
    }
  };

  const zoomOut = () => {
    if (stageRef.current) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const newScale = oldScale / 1.2;
      stage.scale({ x: newScale, y: newScale });
      stage.batchDraw();
    }
  };

  const resetTransform = () => {
    if (stageRef.current) {
      const stage = stageRef.current;
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
    }
  };

  const cells = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      let cellProps: any = {
        key: `${row}-${col}`,
        x: col * CELL_SIZE,
        y: row * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
        stroke: 'gray',
        strokeWidth: 0.5,
        fill: 'white'
      };
      if (col >= 1 && col < gridSize) {
        const low = col - (col & -col);
        const high = col - 1;
        if (row >= low && row <= high) {
          const centerRow = Math.floor((low + high) / 2);
          cellProps.fill = row === centerRow ? 'blue' : 'black';
        }
        if (highlightedPath.includes(col)) {
          cellProps.fill = 'blue';
        }
      }
      
      const { key, ...rest } = cellProps;
      cells.push(
        <Rect
          key={key}
          {...rest}
          onMouseEnter={(e) => {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            if (pointer && col >= 1 && col < gridSize) {
              const index = col;
              const lowbit = index & -index;
              const binary = index.toString(2);
              const low = index - lowbit;
              const high = index - 1;
              setTooltip({
                visible: true,
                x: pointer.x + 10,
                y: pointer.y + 10,
                text: `i: ${index}\nlowbit: ${lowbit}\nбинарное: ${binary}\nпокрытие: [${low}, ${high}]`
              });
            }
          }}
          onMouseMove={(e) => {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            if (pointer && tooltip.visible) {
              setTooltip((prev) => ({ ...prev, x: pointer.x + 10, y: pointer.y + 10 }));
            }
          }}
          onMouseLeave={() => {
            setTooltip({ visible: false, x: 0, y: 0, text: '' });
          }}
        />
      );
    }
  }

  const rangeHighlights = [];
  if (highlightedRange) {
    for (let col = highlightedRange.l; col <= highlightedRange.r; col++) {
      rangeHighlights.push(
        <Rect
          key={`range-${col}`}
          x={col * CELL_SIZE}
          y={0}
          width={CELL_SIZE}
          height={gridSize * CELL_SIZE}
          fill="orange"
          opacity={0.3}
        />
      );
    }
  }

  const labels = [];
  for (let col = 0; col < gridSize; col++) {
    labels.push(
      <KonvaText
        key={`x-${col}`}
        x={col * CELL_SIZE + CELL_SIZE / 2 - 5}
        y={gridSize * CELL_SIZE + 5}
        text={col.toString()}
        fontSize={12}
        fill="black"
      />
    );
  }
  for (let row = 0; row < gridSize; row++) {
    labels.push(
      <KonvaText
        key={`y-${row}`}
        x={-20}
        y={row * CELL_SIZE + CELL_SIZE / 2 - 6}
        text={row.toString()}
        fontSize={12}
        fill="black"
      />
    );
  }

  const binaryLabels = [];
  if (viewMode === 'binary') {
    for (let col = 1; col < gridSize; col++) {
      binaryLabels.push(
        <KonvaText
          key={`bin-${col}`}
          x={col * CELL_SIZE + CELL_SIZE / 2 - 10}
          y={gridSize * CELL_SIZE + 25}
          text={col.toString(2)}
          fontSize={12}
          fill="red"
        />
      );
    }
  }

  const arrows = [];
  for (let i = 1; i < gridSize; i++) {
    const j = i + (i & -i);
    if (j < gridSize) {
      const lowI = i - (i & -i);
      const highI = i - 1;
      const centerY_i = ((lowI + highI) / 2) * CELL_SIZE + CELL_SIZE / 2;
      const centerX_i = i * CELL_SIZE + CELL_SIZE / 2;
      const lowJ = j - (j & -j);
      const highJ = j - 1;
      const centerY_j = ((lowJ + highJ) / 2) * CELL_SIZE + CELL_SIZE / 2;
      const centerX_j = j * CELL_SIZE + CELL_SIZE / 2;
      arrows.push(
        <Arrow
          key={`arrow-${i}`}
          points={[centerX_i, centerY_i, centerX_j, centerY_j]}
          pointerWidth={4}
          pointerLength={6}
          fill="green"
          stroke="green"
          strokeWidth={2}
        />
      );
    }
  }

  const bitTexts = [];
  for (let i = 1; i < gridSize; i++) {
    const low = i - (i & -i);
    const high = i - 1;
    const centerRow = Math.floor((low + high) / 2);
    bitTexts.push(
      <KonvaText
        key={`bitText-${i}`}
        x={i * CELL_SIZE + CELL_SIZE / 2 - 10}
        y={centerRow * CELL_SIZE + CELL_SIZE / 2 - 10}
        text={BIT[i].toString()}
        fontSize={14}
        fill="black"
      />
    );
  }

  const exportImage = (type: 'png' | 'svg') => {
    if (stageRef.current) {
      if (type === 'png') {
        const dataURL = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = 'fenwick_tree.png';
        link.href = dataURL;
        link.click();
      } else {
        const svg = stageRef.current.toSVG();
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'fenwick_tree.svg';
        link.href = url;
        link.click();
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <Stage
        ref={stageRef}
        width={gridSize * CELL_SIZE}
        height={viewMode === 'binary' ? gridSize * CELL_SIZE + 50 : gridSize * CELL_SIZE + 30}
        draggable
        onWheel={(e) => {
          e.evt.preventDefault();
          const scaleBy = 1.05;
          const stage = e.target.getStage();
          if (stage) {
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            const mousePointTo = {
              x: (pointer.x - stage.x()) / oldScale,
              y: (pointer.y - stage.y()) / oldScale
            };
            const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
            stage.scale({ x: newScale, y: newScale });
            const newPos = {
              x: pointer.x - mousePointTo.x * newScale,
              y: pointer.y - mousePointTo.y * newScale
            };
            stage.position(newPos);
            stage.batchDraw();
          }
        }}
      >
        <Layer>
          {cells}
          {rangeHighlights}
          {arrows}
          {labels}
          {binaryLabels}
          {bitTexts}
        </Layer>
      </Stage>
      {tooltip.visible && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: tooltip.y,
            left: tooltip.x,
            padding: 1,
            whiteSpace: 'pre-line',
            pointerEvents: 'none'
          }}
        >
          <Typography variant="caption">{tooltip.text}</Typography>
        </Paper>
      )}
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Tooltip title="Экспортировать изображение в формате PNG">
          <Button variant="outlined" onClick={() => exportImage('png')}>
            Экспорт PNG
          </Button>
        </Tooltip>
        <Tooltip title="Экспортировать изображение в формате SVG">
          <Button variant="outlined" onClick={() => exportImage('svg')}>
            Экспорт SVG
          </Button>
        </Tooltip>
      </Box>
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={zoomIn}>
          Zoom In
        </Button>
        <Button variant="outlined" onClick={zoomOut}>
          Zoom Out
        </Button>
        <Button variant="outlined" onClick={resetTransform}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default FenwickTreeCanvas;
