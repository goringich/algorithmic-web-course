import React, { useEffect } from "react";
import { Circle, Text } from "react-konva";
import Konva from "konva";
import { VisNode } from "@src/visualizations/types/VisNode";

interface SegmentTreeNodeProps {
  node: VisNode;
  allNodes: VisNode[];
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
  onNodeClick: (node: VisNode) => void;
  strokeWidth: number;
  textColor: string;
  fillOverride?: string;
}

// Создаёт карту узлов (nodeMap) для быстрого доступа по id
const buildNodeMap = (nodes: VisNode[]): Record<number, VisNode> => {
  const map: Record<number, VisNode> = {};
  nodes.forEach((n) => {
    map[n.id] = n;
  });
  return map;
};

// Вычисляет глубину (depth — глубина) узла на основе поля parentId
function computeDepth(node: VisNode, nodeMap: Record<number, VisNode>): number {
  let depth = 0;
  let current: VisNode | undefined = node;
  while (current && current.parentId !== current.id) {
    depth++;
    current = nodeMap[current.parentId];
    if (!current) break;
  }
  return depth;
}

// Вычисляет путь от листа до корня (path — путь)
function getPathToRoot(leaf: VisNode, nodeMap: Record<number, VisNode>): number[] {
  const path: number[] = [];
  let current: VisNode | undefined = leaf;
  while (current && current.parentId !== current.id) {
    path.push(current.id);
    current = nodeMap[current.parentId];
  }
  if (current) path.push(current.id);
  return path.reverse();
}

export const SegmentTreeNode: React.FC<SegmentTreeNodeProps> = ({
  node,
  allNodes,
  shapeRefs,
  onNodeClick,
  strokeWidth,
  textColor,
  fillOverride,
}) => {
  const nodeMap = buildNodeMap(allNodes);
  const depthComputed = computeDepth(node, nodeMap);
  // Для примера можно получить и путь от листа до корня
  const path = getPathToRoot(node, nodeMap);

  useEffect(() => {
    console.log(
      `Rendering node id: ${node.id} - isHighlighted: ${node.isHighlighted}, computed depth: ${depthComputed}, path: ${path}`
    );
  }, [node, depthComputed, path]);

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

  const minColor = [10, 10, 120];
  const maxColor = [180, 220, 255];
  const maxDepth = 6;
  const depthFactor = Math.pow(Math.min(depthComputed / maxDepth, 1), 0.7);

  const interpolateColor = (min: number, max: number, factor: number) =>
    Math.round(min + (max - min) * factor);

  const baseFillColor = fillOverride
    ? fillOverride
    : `rgb(${interpolateColor(minColor[0], maxColor[0], depthFactor)}, ${interpolateColor(
        minColor[1],
        maxColor[1],
        depthFactor
      )}, ${interpolateColor(minColor[2], maxColor[2], depthFactor)})`;

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
