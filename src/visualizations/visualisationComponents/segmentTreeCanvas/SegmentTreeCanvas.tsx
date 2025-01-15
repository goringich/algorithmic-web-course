// SegmentTreeCanvas.tsx
import React, { useEffect, useRef } from "react";
import { Layer, Line, Stage } from "react-konva";
import { SegmentTreeNode } from "../segmentTreeNode/SegmentTreeNode";
import { useSegmentTreeContext } from "../../segmentTreeVisualizer/common/context/SegmentTreeContext";
import { VisNode } from "../../visualisationComponents/nodeAnimations/types/VisNode";

interface SegmentTreeCanvasProps {
  getTextColor: (fill: string) => string;
  onNodeClick: (node: VisNode) => void;
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

export function SegmentTreeCanvas({
  getTextColor,
  onNodeClick
}: SegmentTreeCanvasProps) {
  const { nodes, shapeRefs, parentMap } = useSegmentTreeContext();
  const nodesMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [nodes]);

  const { 
    circleColor, 
    highlightColor, 
    selectedColor, 
    lineColor, 
    leafStrokeWidth, 
    internalNodeStrokeWidth, 
    selectedNodeId 
  } = useSegmentTreeContext();

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
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
}
