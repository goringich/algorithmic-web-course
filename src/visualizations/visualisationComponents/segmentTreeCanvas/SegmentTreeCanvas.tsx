import React, { useEffect, useRef, useMemo } from "react";
import { Layer, Line, Stage } from "react-konva";
import { SegmentTreeNode } from "../segmentTreeNode/SegmentTreeNode";

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

interface SegmentTreeCanvasProps {
  nodes: NodeData[];
  shapeRefs: React.MutableRefObject<Record<string, any>>;
  selectedNodeId: string | null;
  stageSize: { width: number; height: number };
  circleColor: string;
  highlightColor: string;
  selectedColor: string;
  lineColor: string;
  leafStrokeWidth: number;
  internalNodeStrokeWidth: number;
  getTextColor: (fill: string) => string;
  onNodeClick: (node: NodeData) => void;
}

export function SegmentTreeCanvas({
  nodes = [],
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
}: SegmentTreeCanvasProps) {
  // Карта узлов
  const nodesMap = useMemo(() => {
    if (!nodes || nodes.length === 0) return {};
    return Object.fromEntries(nodes.map((node) => [node.id, node]));
  }, [nodes]);

  // Глубины узлов
  const depthsRef = useRef<Record<string, number>>({});
  useMemo(() => {
    if (Object.keys(depthsRef.current).length !== nodes.length) {
      const depths: Record<string, number> = {};
      const calculateNodeDepth = (nodeId: string, currentDepth: number = 0): number => {
        if (depths[nodeId] !== undefined) return depths[nodeId];
        const parent = Object.values(nodesMap).find((n) => n.children.includes(nodeId));
        const depth = parent ? calculateNodeDepth(parent.id, currentDepth + 1) : currentDepth;
        depths[nodeId] = depth;
        return depth;
      };
      nodes.forEach((node) => calculateNodeDepth(node.id));
      depthsRef.current = depths;
    }
  }, [nodes, nodesMap]);

  const layerRef = useRef<any>(null);

  // Линии
  const renderLines = useMemo(
    () =>
      nodes.flatMap((parentNode) =>
        parentNode.children.map((childId) => {
          const childNode = nodesMap[childId];
          if (!childNode) return null;
          return (
            <Line
              key={`${parentNode.id}-${childId}`}
              points={[parentNode.x, parentNode.y, childNode.x, childNode.y]}
              stroke={lineColor}
              strokeWidth={2}
              lineCap="round"
            />
          );
        })
      ),
    [nodes, nodesMap, lineColor]
  );

  // Узлы
  const renderNodes = useMemo(
    () =>
      nodes.map((node) => {
        const isLeaf = node.range[0] === node.range[1];
        const fillColor = node.isHighlighted
          ? highlightColor
          : selectedNodeId === node.id
          ? selectedColor
          : circleColor;
        const strokeW = isLeaf ? leafStrokeWidth : internalNodeStrokeWidth;

        return (
          <SegmentTreeNode
            key={node.id}
            node={{ ...node, depth: depthsRef.current[node.id] }}
            shapeRef={(el) => (shapeRefs.current[node.id] = el)}
            onNodeClick={onNodeClick}
            fillColor={fillColor}
            strokeWidth={strokeW}
            textColor={getTextColor(fillColor)}
          />
        );
      }),
    [nodes, selectedNodeId, circleColor, highlightColor, selectedColor, depthsRef, shapeRefs, leafStrokeWidth, internalNodeStrokeWidth, getTextColor, onNodeClick]
  );

  // BatchDraw
  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [nodes]);

  return (
    <Stage width={stageSize.width} height={stageSize.height}>
      <Layer ref={layerRef}>{renderLines}{renderNodes}</Layer>
    </Stage>
  );
}
