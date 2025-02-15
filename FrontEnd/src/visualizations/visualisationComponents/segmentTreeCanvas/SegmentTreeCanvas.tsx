import React from "react";
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
  // Создаем карту узлов для удобства вычисления глубины
  const nodesMap = React.useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, node])),
    [nodes]
  );

  // Функция для вычисления глубины узла
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
          // Вычисляем глубину узла для корректного расчета цвета
          const depth = calculateDepth(node);
          const nodeWithDepth = { ...node, depth };
          // Если узел выбран, можно задать переопределение цвета
          const fillOverride =
            selectedNode && selectedNode.id === node.id ? "red" : undefined;
          return (
            <SegmentTreeNode
              key={node.id}
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