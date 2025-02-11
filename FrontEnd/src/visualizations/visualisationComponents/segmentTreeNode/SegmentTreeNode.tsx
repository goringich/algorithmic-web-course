import React from "react";
import { Circle, Text } from "react-konva";
import Konva from "konva";

interface NodeData {
  id: number;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: number[];
  depth?: number; 
  isHighlighted?: boolean;
}

interface SegmentTreeNodeProps {
  node: NodeData;
  shapeRef: (el: Konva.Circle | null) => void;
  onNodeClick: (node: NodeData) => void;
  strokeWidth: number;
  textColor: string;
}

export function SegmentTreeNode({
  node,
  shapeRef,
  onNodeClick,
  strokeWidth,
  textColor
}: SegmentTreeNodeProps) {

  const maxDepth = 6;
  const depth = node.depth !== undefined ? node.depth : 0;
  const depthFactor = Math.pow(Math.min(depth / maxDepth, 1), 0.7);
  const minColor = [10, 10, 120];
  const maxColor = [180, 220, 255];

  const interpolateColor = (min: number, max: number, factor: number) =>
    Math.round(min + (max - min) * factor);

  const fillColor = node.isHighlighted
    ? "orange"
    : `rgb(${interpolateColor(minColor[0], maxColor[0], depthFactor)}, 
           ${interpolateColor(minColor[1], maxColor[1], depthFactor)}, 
           ${interpolateColor(minColor[2], maxColor[2], depthFactor)})` || "#4B7BEC";

           
  // console.log(`Node ${node.id} highlighted:`, node.isHighlighted);

  return (
    <>
      <Circle
  key={`${node.id}-${node.isHighlighted}`} // Ключ для ререндеринга
  ref={shapeRef}
  x={node.x}
  y={node.y}
  radius={30}
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
        x={node.x - 25}
        y={node.y - 15}
        text={`${node.label}\n(${node.value})`}
        fontSize={12}
        fill={textColor}
        align="center"
        width={50}
      />
    </>
  );
}
