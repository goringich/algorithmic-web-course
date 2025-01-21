import { useCallback } from "react";
import { VisNode } from "../../nodeAnimations/types/VisNode";
import { buildPathFromLeaf } from "../buildPathFromLeaf";
import useNodeAnimations from "./useNodeAnimations";

interface UseHighlightPathProps {
  nodes: VisNode[];
  parentMap: Record<string, string>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

export default function useHighlightPath({
  nodes,
  parentMap,
  setNodes
}: UseHighlightPathProps) {
  const { animatePath, clearAllTimeouts } = useNodeAnimations({ setNodes });

  const highlightPathFromLeaf = useCallback(
    (leafNodeId: string) => {
      // Сбрасываем все таймауты и подсветки
      clearAllTimeouts();
      setNodes((old) =>
        old.map((n) => (n.isHighlighted ? { ...n, isHighlighted: false } : n))
      );

      // Проверяем, есть ли такой узел
      const leafNode = nodes.find((n) => n.id === leafNodeId);
      if (!leafNode) {
        console.error(`Leaf node with ID '${leafNodeId}' not found`);
        return;
      }

      // Строим путь
      const pathIds = buildPathFromLeaf(leafNodeId, nodes, parentMap);
      if (pathIds.length === 0) {
        console.warn(`No path found from leaf '${leafNodeId}' to root`);
        return;
      }

      // Запускаем анимацию подсветки
      animatePath(pathIds);
    },
    [nodes, parentMap, setNodes, animatePath, clearAllTimeouts]
  );

  return highlightPathFromLeaf;
}
