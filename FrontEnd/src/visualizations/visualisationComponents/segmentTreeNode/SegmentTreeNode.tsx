import React, { useEffect } from "react";
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
  parentMap?: Record<number, number | undefined>;
}

function computeDepth(nodeId: number, parentMap: Record<number, number | undefined>): number {
  let depth = 0;
  let current = nodeId;
  while (parentMap[current] !== undefined && parentMap[current] !== current) {
    depth++;
    current = parentMap[current]!;
  }
  return depth;
}

export const SegmentTreeNode: React.FC<SegmentTreeNodeProps> = ({
  node,
  shapeRefs,
  onNodeClick,
  strokeWidth,
  textColor,
  fillOverride,
  parentMap,
}) => {
  // Если depth не задан, пытаемся вычислить его через parentMap, иначе 0
  const depthComputed =
    node.depth !== undefined ? node.depth : parentMap ? computeDepth(node.id, parentMap) : 0;

  useEffect(() => {
    console.log(
      `Rendering node id: ${node.id} - isHighlighted: ${node.isHighlighted}, computed depth: ${depthComputed}`
    );
  }, [node, depthComputed]);

  if (node.isDummy) {
    console.log(`Node ${node.id} is dummy`);
    return (
      <Circle
        key={node.id}
        ref={(el) => {
          if (el) shapeRefs.current[node.id] = el;
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

  // Исходные цвета для заливки (градация от [10,10,120] до [180,220,255])
  const minColor = [10, 10, 120];
  const maxColor = [180, 220, 255];
  const maxDepth = 6;
  const depthFactor = Math.pow(Math.min(depthComputed / maxDepth, 1), 0.7);

  const interpolateColor = (min: number, max: number, factor: number) =>
    Math.round(min + (max - min) * factor);

  // Формируем строку цвета без разрывов
  const baseFillColor = fillOverride
    ? fillOverride
    : `rgb(${interpolateColor(minColor[0], maxColor[0], depthFactor)}, ${interpolateColor(
        minColor[1],
        maxColor[1],
        depthFactor
      )}, ${interpolateColor(minColor[2], maxColor[2], depthFactor)})`;

  // Если узел входит в путь (isHighlighted), делаем фон красным
  const computedFillColor = node.isHighlighted ? "red" : baseFillColor;

  console.log(
    `Node ${node.id} baseFillColor: ${baseFillColor}, computedFillColor: ${computedFillColor}`
  );

  return (
    <>
      <Circle
        key={node.id}
        ref={(el) => {
          if (el) shapeRefs.current[node.id] = el;
        }}
        x={node.x}
        y={node.y}
        radius={30}
        fill={computedFillColor}
        stroke="black"
        strokeWidth={strokeWidth}
        onClick={() => {
          console.log(`Node ${node.id} clicked`);
          onNodeClick(node);
        }}
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
