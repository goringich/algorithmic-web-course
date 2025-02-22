import React, { useEffect, useRef } from "react";
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

const buildNodeMap = (nodes: VisNode[]): Record<number, VisNode> => {
  const map: Record<number, VisNode> = {};
  nodes.forEach((n) => {
    map[n.id] = n;
  });
  return map;
};

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

  const minColor = [180, 220, 255];
  const maxColor = [10, 10, 120];
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

  // Создаем локальный ref для анимации
  const circleRef = useRef<Konva.Circle>(null);

  useEffect(() => {
    if (circleRef.current) {
      // Начинаем с прозрачности 0
      circleRef.current.opacity(0);
      circleRef.current.to({
        opacity: 1,
        duration: 0.5,
        easing: Konva.Easings.EaseInOut,
        onFinish: () =>
          console.log(`[INFO] Node ${node.id} fully appeared at (${node.x}, ${node.y})`),
      });
    }
    // Регистрируем узел в shapeRefs, если ещё не зарегистрирован
    if (circleRef.current && !shapeRefs.current[node.id]) {
      shapeRefs.current[node.id] = circleRef.current;
    }
  }, []); // Запускается только при монтировании

  return (
    <>
      <Circle
        ref={(el) => {
          circleRef.current = el;
          if (el) shapeRefs.current[node.id] = el;
        }}
        x={node.x}
        y={node.y}
        radius={30}
        fill={computedFillColor}
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
