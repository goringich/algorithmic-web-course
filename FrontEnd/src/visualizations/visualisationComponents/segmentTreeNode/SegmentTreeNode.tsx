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
  isDummy?: boolean;
}

interface SegmentTreeNodeProps {
  node: NodeData;
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
  onNodeClick: (node: NodeData) => void;
  strokeWidth: number;
  textColor: string;
  fillOverride?: string; 
}

export const SegmentTreeNode: React.FC<SegmentTreeNodeProps> = ({
  node,
  shapeRefs,
  onNodeClick,
  strokeWidth,
  textColor,
  fillOverride
}) => {
  if (node.isDummy) {
    return (
      <Circle
        key={node.id}
        ref={(el) => {
          if (el) {
            shapeRefs.current[node.id] = el;
          }
        }}
        x={node.x}
        y={node.y}
        radius={30}
        fill="transparent"
        stroke="transparent"
        strokeWidth={0}
        listening={false}
      />
    );
  }

  const maxDepth = 6;
  const depth = node.depth ?? 0;
  const depthFactor = Math.pow(Math.min(depth / maxDepth, 1), 0.7);

  const minColor = [10, 10, 120];
  const maxColor = [180, 220, 255];

  const interpolateColor = (min: number, max: number, factor: number) =>
    Math.round(min + (max - min) * factor);

  // Если задан fillOverride, используем его, иначе рассчитываем по глубине
  const fillColor = fillOverride
    ? fillOverride
    : `rgb(
        ${interpolateColor(minColor[0], maxColor[0], depthFactor)},
        ${interpolateColor(minColor[1], maxColor[1], depthFactor)},
        ${interpolateColor(minColor[2], maxColor[2], depthFactor)}
      )`;

  return (
    <>
      <Circle
        key={node.id}
        ref={(el) => {
          if (el) {
            shapeRefs.current[node.id] = el;
          }
        }}
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
};
