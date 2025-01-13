import React from "react";
import { Circle, Text } from "react-konva";
import Konva from "konva";

interface NodeData {
  id: string;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: string[];
  isHighlighted?: boolean;
}

interface SegmentTreeNodeProps {
  node: NodeData;
  shapeRef: (el: Konva.Circle | null) => void;
  onNodeClick: (node: NodeData) => void;
  fillColor: string;
  strokeWidth: number;
  textColor: string;
}

export function SegmentTreeNode({
  node,
  shapeRef,
  onNodeClick,
  fillColor,
  strokeWidth,
  textColor
}: SegmentTreeNodeProps) {
  const radius = 30;

  return (
    <>
      <Circle
        ref={shapeRef}
        x={node.x}
        y={node.y}
        radius={radius}
        fill={fillColor}
        stroke="black"
        strokeWidth={strokeWidth}
        onClick={() => onNodeClick(node)}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "pointer";
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "default";
        }}
        shadowColor="#000"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 2 }}
        shadowOpacity={0.2}
      />
      <Text
        x={node.x - radius + 2}
        y={node.y - 10}
        text={`${node.label}\n(${node.value})`}
        fontSize={12}
        fill={textColor}
        align="center"
        width={2 * radius - 4}
      />
    </>
  );
}
