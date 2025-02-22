import React, { useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";
import { SegmentTreeNode } from "../segmentTreeNode/SegmentTreeNode";
import { VisNode } from "../../types/VisNode";

interface SegmentTreeCanvasProps {
  nodes: VisNode[];
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
  layerRef: React.MutableRefObject<Konva.Layer | null>;
  stageSize: { width: number; height: number };
  onNodeClick: (node: VisNode) => void;
}

export const SegmentTreeCanvas: React.FC<SegmentTreeCanvasProps> = ({
  nodes,
  shapeRefs,
  layerRef,
  stageSize,
  onNodeClick,
}) => {
  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [nodes, layerRef]);

  return (
    <Stage width={stageSize.width} height={stageSize.height}>
      <Layer ref={layerRef}>
        {nodes.map((parentNode) =>
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
        {nodes.map((node) => (
          <SegmentTreeNode
            key={node.id}
            node={node}
            allNodes={nodes}
            shapeRefs={shapeRefs}
            onNodeClick={onNodeClick}
            strokeWidth={node.range[0] === node.range[1] ? 2 : 4}
            textColor="white"
          />
        ))}
      </Layer>
    </Stage>
  );
};
