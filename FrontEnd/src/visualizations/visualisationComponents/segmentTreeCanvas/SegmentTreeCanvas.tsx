import React, { useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { SegmentTreeNode } from "../segmentTreeNode/SegmentTreeNode";
import Konva from "konva";
import { VisNode } from "../../types/VisNode";

interface SegmentTreeCanvasProps {
  nodes: VisNode[];
  selectedNode: VisNode | null;
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
  layerRef: React.MutableRefObject<Konva.Layer | null>;
  stageSize: { width: number; height: number };
  onNodeClick: (node: VisNode) => void;
}

export const SegmentTreeCanvas: React.FC<SegmentTreeCanvasProps> = ({
  nodes,
  selectedNode,
  shapeRefs,
  layerRef,
  stageSize,
  onNodeClick,
}) => {
  const nodesMap = React.useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, node])),
    [nodes]
  );

  const calculateDepth = (node: VisNode): number => {
    let depth = 0;
    let current = node;
    while (true) {
      const parent = Object.values(nodesMap).find((n) =>
        n.children.includes(current.id)
      );
      if (!parent) break;
      depth++;
      current = parent;
    }
    return depth;
  };

  // При изменении узлов принудительно перерисовываем слой
  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [nodes, layerRef]);

  return (
    <Stage width={stageSize.width} height={stageSize.height}>
      <Layer ref={layerRef}>
        {/* Рисуем линии между узлами */}
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
        {/* Рисуем сами узлы */}
        {nodes.map((node) => {
          const depth = calculateDepth(node);
          const nodeWithDepth = { ...node, depth };

          const fillOverride =
            selectedNode && selectedNode.id === node.id ? "red" : undefined;
          // Используем ключ на основе диапазона, чтобы избежать проблем при обновлении
          return (
            <SegmentTreeNode
              key={`${node.range[0]}-${node.range[1]}`}
              node={nodeWithDepth}
              shapeRefs={shapeRefs}
              onNodeClick={onNodeClick}
              strokeWidth={node.range[0] === node.range[1] ? 2 : 4}
              textColor="white"
              fillOverride={fillOverride}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};
