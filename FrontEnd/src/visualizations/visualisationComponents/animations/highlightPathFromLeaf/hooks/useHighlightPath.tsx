import { useCallback, useRef } from "react";
import { VisNode } from "../../../../types/VisNode";
import { buildPathFromLeaf } from "../buildPathFromLeaf";
import useNodeAnimations from "./useNodeAnimations";

interface UseHighlightPathProps {
  nodes: VisNode[];
  parentMap: Record<number, number | undefined>;
  setHighlightedNodes: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function useHighlightPath({ nodes, parentMap, setHighlightedNodes }: UseHighlightPathProps) {
  const { animatePath, clearAllTimeouts } = useNodeAnimations({ setHighlightedNodes });
  const isAnimatingRef = useRef(false);

  const highlightPathFromLeaf = useCallback(
    (leafNodeId: number) => {
      // if (isAnimatingRef.current) {
      //   console.warn("Анимация уже запущена. Пропускаем повторный вызов.");
      //   return;
      // }
      isAnimatingRef.current = true;
      console.log("highlightPathFromLeaf вызвана для leafNodeId:", leafNodeId);
      clearAllTimeouts();
      setHighlightedNodes([]);

      const leafNode = nodes.find((node) => node.id === leafNodeId);
      console.log("Найденный узел:", leafNode);
      if (!leafNode) {
        console.error(`Leaf node with ID '${leafNodeId}' not found.`);
        isAnimatingRef.current = false;
        return;
      }

      console.log("parentMap:", parentMap);
      const pathIds = buildPathFromLeaf(leafNode.id, nodes, parentMap);
      console.log("Вычисленный путь:", pathIds);
      if (pathIds.length === 0) {
        console.warn("No path computed for leaf node:", leafNodeId);
        isAnimatingRef.current = false;
        return;
      }
      animatePath(pathIds);
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, pathIds.length * 400 + 1100);
    },
    [nodes, parentMap, setHighlightedNodes, animatePath, clearAllTimeouts]
  );

  return highlightPathFromLeaf;
}
