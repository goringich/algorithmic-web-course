// src/components/TreeArea.tsx
import React from 'react';
import { SegmentTreeCanvas } from '../visualisationComponents/segmentTreeCanvas/SegmentTreeCanvas';
import { VisNode } from '../visualisationComponents/nodeAnimations/types/VisNode';

interface TreeAreaProps {
  selectedNodeId: number | null;
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
}) => {
  return (
    <SegmentTreeCanvas
      circleColor={circleColor}
      highlightColor={highlightColor}
      selectedColor={selectedColor}
      lineColor={lineColor}
      leafStrokeWidth={leafStrokeWidth}
      internalNodeStrokeWidth={internalNodeStrokeWidth}
      getTextColor={getTextColor}
      onNodeClick={onNodeClick}
      selectedNodeId={selectedNodeId}
      stageSize={stageSize}
    />
  );
};

export default TreeArea;