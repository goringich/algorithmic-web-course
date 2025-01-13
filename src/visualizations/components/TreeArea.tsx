// src/visualisations/segmentTreeVisualizer/components/TreeArea.tsx

import React from 'react';
import { SegmentTreeCanvas } from '../visualisationComponents/segmentTreeCanvas/SegmentTreeCanvas';
import { VisNode } from '../visualisationComponents/nodeAnimations/types/VisNode';

interface TreeAreaProps {
  nodes: VisNode[];
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>; // Изменено на Record<number, ...>
  selectedNodeId: number | null; // Изменено на number | null
  stageSize: { width: number; height: number };
  circleColor: string;
  highlightColor: string;
  selectedColor: string;
  lineColor: string;
  leafStrokeWidth: number;
  internalNodeStrokeWidth: number;
  getTextColor: (fill: string) => string;
  onNodeClick: (node: VisNode) => void;
}

const TreeArea: React.FC<TreeAreaProps> = ({
  nodes,
  shapeRefs,
  selectedNodeId,
  stageSize,
  circleColor,
  highlightColor,
  selectedColor,
  lineColor,
  leafStrokeWidth,
  internalNodeStrokeWidth,
  getTextColor,
  onNodeClick
}) => (
  <SegmentTreeCanvas
    nodes={nodes}
    shapeRefs={shapeRefs}
    selectedNodeId={selectedNodeId}
    stageSize={stageSize}
    circleColor={circleColor}
    highlightColor={highlightColor}
    selectedColor={selectedColor}
    lineColor={lineColor}
    leafStrokeWidth={leafStrokeWidth}
    internalNodeStrokeWidth={internalNodeStrokeWidth}
    getTextColor={getTextColor}
    onNodeClick={onNodeClick}
  />
);

export default TreeArea;
