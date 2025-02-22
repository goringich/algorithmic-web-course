import { useCallback } from "react";
import { VisNode } from "../../../../types/VisNode";
import { buildPathFromLeaf } from "../buildPathFromLeaf";
import useNodeAnimations from "./useNodeAnimations";

interface UseHighlightPathProps {
  nodes: VisNode[];
  parentMap: Record<number, number | undefined>;
  setHighlightedNodes: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function useHighlightPath({
  nodes,
  parentMap,
  setHighlightedNodes,
}: UseHighlightPathProps) {
  const { animatePath, clearAllTimeouts } = useNodeAnimations({ setHighlightedNodes });
  const highlightPathFromLeaf = useCallback(
    (leafNodeId: number) => {
      clearAllTimeouts();
      setHighlightedNodes([]); // Сброс выделения (reset highlight)
      const leafNode = nodes.find((node) => node.id === leafNodeId);
      if (!leafNode) {
        console.error(`Leaf node with ID '${leafNodeId}' not found.`);
        return;
      }
      // Используем переданную карту родителей (parentMap) для вычисления пути
      const pathIds = buildPathFromLeaf(leafNode.id, nodes, parentMap);
      if (pathIds.length === 0) {
        console.warn("No path computed for leaf node:", leafNodeId);
        return;
      }
      animatePath(pathIds);
    },
    [nodes, parentMap, setHighlightedNodes, animatePath, clearAllTimeouts]
  );
  return highlightPathFromLeaf;
}
