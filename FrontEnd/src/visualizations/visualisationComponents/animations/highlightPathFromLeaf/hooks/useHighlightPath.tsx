import { useCallback } from "react";
import { VisNode } from "../../../../types/VisNode";
import { buildPathFromLeaf } from "../buildPathFromLeaf";
import { buildParentMap } from "../../utils/buildParentMap";
import useNodeAnimations from "./useNodeAnimations";

interface UseHighlightPathProps {
  nodes: VisNode[];
  parentMap: Record<number, number | undefined>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

export default function useHighlightPath({A
  nodes,
  parentMap,
  setNodes,
}: UseHighlightPathProps) {
  const { animatePath, clearAllTimeouts } = useNodeAnimations({ setNodes });

  const highlightPathFromLeaf = useCallback(
    (leafNodeId: number) => {
      console.log("Starting highlightPathFromLeaf for leaf ID:", leafNodeId);
      clearAllTimeouts();

      setNodes((oldNodes) =>
        oldNodes.map((node) => ({ ...node, isHighlighted: false }))
      );

      const leafNode = nodes.find((node) => node.id === leafNodeId);
      if (!leafNode) {
        console.error(`Leaf node with ID '${leafNodeId}' not found.`);
        return;
      }
      console.log("Found leaf node:", leafNode);

      const updatedParentMap = buildParentMap(nodes);
      console.log("Updated parent map:", updatedParentMap);

      const pathIds = buildPathFromLeaf(leafNode.id, nodes, updatedParentMap);
      console.log("Computed path IDs:", pathIds);

      if (pathIds.length === 0) {
        console.warn("No path computed for leaf node:", leafNodeId);
        return;
      }

      animatePath(pathIds);
    },
    [nodes, setNodes, animatePath, clearAllTimeouts]
  );

  return highlightPathFromLeaf;
}
