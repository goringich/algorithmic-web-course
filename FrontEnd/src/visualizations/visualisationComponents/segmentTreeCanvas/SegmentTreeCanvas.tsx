import React, { useEffect, useRef } from "react";
import { Layer, Line, Stage } from "react-konva";
import { SegmentTreeNode } from "../segmentTreeNode/SegmentTreeNode";
import { useSegmentTreeContext } from "../../segmentTreeVisualizer/common/context/segmentTreeContext/SegmentTreeContext";
import { VisNode } from "../nodeAnimations/types/VisNode";

interface SegmentTreeCanvasProps {
  circleColor: string;
  highlightColor: string;
  selectedColor: string;
  lineColor: string;
  leafStrokeWidth: number;
  internalNodeStrokeWidth: number;
  getTextColor: (fill: string) => string;
  onNodeClick: (node: VisNode) => void;
  selectedNodeId: number | null;
  stageSize: { width: number; height: number };
}

function calculateDepth(node: VisNode, nodesMap: Record<string, VisNode>): number {
  let depth = 0;
  let current = node;

  while (current && nodesMap[current.id]) {
    const parent = Object.values(nodesMap).find((n) => n.children.includes(current.id));
    if (!parent) break;
    depth++;
    current = parent;
  }

  return depth;
}

export const SegmentTreeCanvas: React.FC<SegmentTreeCanvasProps> = ({
  circleColor,
  highlightColor,
  selectedColor,
  lineColor,
  leafStrokeWidth,
  internalNodeStrokeWidth,
  getTextColor,
  onNodeClick,
  selectedNodeId,
  stageSize
}) => {
  const { nodes, shapeRefs } = useSegmentTreeContext();
  const nodesMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const layerRef = useRef<any>(null);

  // console.log("logs: ", nodes);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [nodes]);

  return (
    <Stage width={stageSize.width} height={stageSize.height}>
      <Layer ref={layerRef}>
        {nodes.map((parentNode) =>
          parentNode.children.map((childId) => {
            const childNode = nodes.find((n) => n.id === childId);
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
        )}

        {nodes.map((node) => {
          const isLeaf = node.range[0] === node.range[1];
          let fillColor = circleColor;
          if (node.isHighlighted) fillColor = highlightColor;
          else if (selectedNodeId === node.id) fillColor = selectedColor;
          const strokeW = isLeaf ? leafStrokeWidth : internalNodeStrokeWidth;

          const depth = calculateDepth(node, nodesMap);

          return (
            <SegmentTreeNode
              key={node.id}
              node={{ ...node, depth }}
              shapeRef={(el) => (shapeRefs.current[node.id] = el)}
              onNodeClick={onNodeClick}
              fillColor={fillColor}
              strokeWidth={strokeW}
              textColor={getTextColor(fillColor)}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};