import React from "react";
import { Layer, Line, Stage } from "react-konva";
import { SegmentTreeNode } from "../segmentTreeNode/SegmentTreeNode";
import { useSegmentTreeContext } from "../../segmentTreeVisualizer/common/context/segmentTreeContext/SegmentTreeContext";
import { VisNode } from "../../types/VisNode";

function calculateDepth(node: VisNode, nodesMap: Record<number, VisNode>): number {
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

export const SegmentTreeCanvas: React.FC = () => {
  const { nodes, shapeRefs, layerRef, stageSize, onNodeClick, selectedNode } = useSegmentTreeContext();
  const nodesMap = Object.fromEntries(nodes.map((node) => [node.id, node]));

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
                stroke="black"
                strokeWidth={2}
                lineCap="round"
              />
            );
          })
        )}

        {nodes.map((node) => {
          const isLeaf = node.range[0] === node.range[1];
          let fillColor = "black";
          if (node.isHighlighted) fillColor = "yellow";
          else if (selectedNode === node) fillColor = "red";
          const strokeW = isLeaf ? 2 : 4;

          const depth = calculateDepth(node, nodesMap);

          return (
            <SegmentTreeNode
              key={node.id}
              node={{ ...node, depth }}
              shapeRef={(el) => (shapeRefs.current[node.id] = el)}
              onNodeClick={onNodeClick}
              fillColor={fillColor}
              strokeWidth={strokeW}
              textColor="white"
            />
          );
        })}
      </Layer>
    </Stage>
  );
};
