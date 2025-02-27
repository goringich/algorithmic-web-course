import React, { useEffect, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";
import { SegmentTreeNode } from "../segmentTreeNode/SegmentTreeNode";
import { VisNode } from "../../types/VisNode";

interface SegmentTreeCanvasProps {
  nodes: VisNode[];
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
  stageSize: { width: number; height: number };
  onNodeClick: (node: VisNode) => void;
  highlightedNodes: number[];
}

export const SegmentTreeCanvas: React.FC<SegmentTreeCanvasProps> = ({
  nodes,
  shapeRefs,
  stageSize,
  onNodeClick,
  highlightedNodes
}) => {
  const layerRef = useRef<Konva.Layer | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [nodes]);

  return (
    <Stage width={stageSize.width} height={stageSize.height}>
      <Layer ref={layerRef}>
        {nodes.flatMap((parentNode) =>
          parentNode.children.map((childId) => {
            const childNode = nodes.find((n) => n.id === childId);
            if (!childNode) return null;
            return (
              <Line
                key={`line-${parentNode.id}-${childId}`}
                points={[parentNode.x, parentNode.y, childNode.x, childNode.y]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
              />
            );
          })
        )}
        {nodes.map((node) => {
          const highlightIndex = highlightedNodes.indexOf(node.id);
          return (
            <SegmentTreeNode
              key={node.id}
              node={node}
              allNodes={nodes}
              shapeRefs={shapeRefs}
              onNodeClick={onNodeClick}
              isHighlighted={highlightedNodes.includes(node.id)}
              strokeWidth={node.range[0] === node.range[1] ? 2 : 4}
              textColor="white"
              highlightIndex={highlightIndex}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};
