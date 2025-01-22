import { useCallback } from "react";
import { VisNode } from "../../nodeAnimations/types/VisNode";
import { buildPathFromLeaf } from "../buildPathFromLeaf";
import { validateParentMap } from "../utils/validateParentMap";
import useNodeAnimations from "./useNodeAnimations";

interface UseHighlightPathProps {
  nodes: VisNode[];
  parentMap: Record<number, number>
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
      clearAllTimeouts();

      setNodes((oldNodes) =>
        oldNodes.map((node) => ({
          ...node,
          isHighlighted: false
        }))
      );

      const leafNode = nodes.find((node) => node.id === leafNodeId);
      if (!leafNode) {
        console.error(`Leaf node with ID '${leafNodeId}' not found.`);
        return;
      }

      if (!validateParentMap(parentMap)) {
        throw new Error("Invalid parentMap: Cycles or orphan nodes detected.");
      }
      const pathIds = buildPathFromLeaf(leafNodeId, nodes, parentMap);
      if (pathIds.length === 0) {
        console.warn(`No path found from leaf node '${leafNodeId}' to root.`);
        return;
      }

      animatePath(pathIds);
    },
    [nodes, parentMap, setNodes, animatePath, clearAllTimeouts]
  );

  return highlightPathFromLeaf;
}

