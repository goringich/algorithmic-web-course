import React, { useEffect, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";
import { SegmentTreeNode } from "../segmentTreeNode/SegmentTreeNode";
import { VisNode } from "../../types/VisNode";
import { animateNodeDisappear } from "../animations/nodeAnimations/animateNodeDisappear";

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
  const prevNodesRef = useRef<Map<number, { x: number; y: number }>>(new Map());

  // useEffect(() => {
  //   const prevNodeIds = new Set(Array.from(prevNodesRef.current.keys()));
  //   const currentNodeIds = new Set(nodes.map((node) => node.id));

  //   const removedNodes = [...prevNodeIds].filter((id) => !currentNodeIds.has(id));

  //   if (removedNodes.length > 0) {
  //     console.log(`[INFO] Обнаружены исчезнувшие узлы: ${removedNodes.join(", ")}`);
  //     removedNodes.forEach((nodeId) => {
  //       animateNodeDisappear(nodeId, shapeRefs.current).then(() => {
  //         console.log(`[INFO] Узел ${nodeId} полностью удалён`);
  //       });
  //     });
  //   }
  // }, [nodes, shapeRefs]);

  // useEffect(() => {
  //   nodes.forEach((node) => {
  //     const shape = shapeRefs.current[node.id];
  //     if (shape) {
  //       const prevPos = prevNodesRef.current.get(node.id);
  //       // Если позиция изменилась (или узел новый – тогда анимация появления уже отрабатывает)
  //       if (prevPos && (prevPos.x !== node.x || prevPos.y !== node.y)) {
  //         console.log(`[INFO] Анимируем перемещение узла ${node.id} из (${prevPos.x}, ${prevPos.y}) в (${node.x}, ${node.y})`);
  //         shape.to({
  //           x: node.x,
  //           y: node.y,
  //           duration: 0.5,
  //           easing: Konva.Easings.EaseInOut,
  //         });
  //       }
  //       // Обновляем состояние позиции узла
  //       prevNodesRef.current.set(node.id, { x: node.x, y: node.y });
  //     } else {
  //       // Если узел новый, его позиция будет установлена при появлении
  //       prevNodesRef.current.set(node.id, { x: node.x, y: node.y });
  //     }
  //   });
  // }, [nodes, shapeRefs]);

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
        {nodes.map((node) => (
          <SegmentTreeNode
            key={node.id}
            node={node}
            allNodes={nodes}
            shapeRefs={shapeRefs}
            onNodeClick={onNodeClick}
            isHighlighted={highlightedNodes.includes(node.id)}
            strokeWidth={node.range[0] === node.range[1] ? 2 : 4}
            textColor="white"
          />
        ))}
      </Layer>
    </Stage>
  );
};
