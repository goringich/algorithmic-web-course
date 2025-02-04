import { useCallback } from "react";
import { VisNode } from "../../nodeAnimations/types/VisNode";
import { buildPathFromLeaf } from "../buildPathFromLeaf";
import { buildParentMap } from "../../../visualisationComponents/nodeAnimations/utils/buildParentMap";
import useNodeAnimations from "./useNodeAnimations";

interface UseHighlightPathProps {
  nodes: VisNode[];
  parentMap: Record<number, number>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

export default function useHighlightPath({
  nodes,
  parentMap,
  setNodes
}: UseHighlightPathProps) {
  const { animatePath, clearAllTimeouts } = useNodeAnimations({ setNodes });

  const highlightPathFromLeaf = useCallback(
    (leafNodeId: number) => {
      console.log("Highlighting path for leaf (Подсвечиваем путь для листа):", leafNodeId);
      clearAllTimeouts();

      // Сброс подсветки для всех узлов
      setNodes((oldNodes) =>
        oldNodes.map((node) => ({
          ...node,
          isHighlighted: false
        }))
      );

      const leafNode = nodes.find((node) => node.id === leafNodeId);
      if (!leafNode) {
        console.error(`Leaf node with ID '${leafNodeId}' not found (Листовой узел с ID '${leafNodeId}' не найден).`);
        return;
      }
      console.log("Found leaf node (Найден листовой узел):", leafNode);

      // Пересчитываем карту родителей для актуальности
      const updatedParentMap = buildParentMap(nodes);
      console.log("Updated parent map (Обновленная карта родителей):", updatedParentMap);

      const pathIds = buildPathFromLeaf(leafNode.id, nodes, updatedParentMap);
      console.log("Computed path IDs (Вычисленные ID пути):", pathIds);

      if (pathIds.length === 0) {
        console.warn("No path computed for leaf node (Путь не вычислен для листового узла):", leafNodeId);
        return;
      }

      animatePath(pathIds);
    },
    [nodes, setNodes, animatePath, clearAllTimeouts]
  );

  return highlightPathFromLeaf;
}
