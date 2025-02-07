import { useState, useCallback, useRef } from "react";
import SegmentTreeWasm from "../../SegmentTreeWasm";
import { VisNode } from "../../../../types/VisNode";
import { buildParentMap } from "../../../../visualisationComponents/nodeAnimations/utils/buildParentMap";

interface UseInitializeSegmentTreeProps {
  initialData: number[];
}

interface UseInitializeSegmentTreeReturn {
  segmentTree: SegmentTreeWasm | null;
  initialNodes: VisNode[];
  initialParentMap: Record<number, number>;
  initialize: () => Promise<void>;
}

const useInitializeSegmentTree = ({
  initialData,
}: UseInitializeSegmentTreeProps): UseInitializeSegmentTreeReturn => {
  const [initialNodes, setInitialNodes] = useState<VisNode[]>([]);
  const [initialParentMap, setInitialParentMap] = useState<Record<number, number >>({});
  const [segmentTree, setSegmentTree] = useState<SegmentTreeWasm | null>(null);

  const initialize = useCallback(async () => {
    if (segmentTree) {
      console.log("Segment tree already initialized.");
      return;
    }

    try {
      console.log("Initializing SegmentTreeWasm...");
      const st = new SegmentTreeWasm(initialData);
      setSegmentTree(st); 

      const nodes = await st.getTreeForVisualization();
      console.log("Nodes initialized:", nodes);

      const visNodes: VisNode[] = nodes.map((node, index) => ({
        ...node,
        parentId: (node as any).parentId ?? (index === 0 ? undefined : 0), 
        isHighlighted: false, 
        children: node.children ?? [],
      }));
      
      setInitialNodes(visNodes);
      const parentMap = buildParentMap(visNodes);
      
      console.log("Parent map initialized:", parentMap);
      setInitialParentMap(parentMap);
    } catch (error) {
      console.error("Error during segment tree initialization:", error);
      throw error; 
    }
  }, [initialData, segmentTree]);

  return {
    segmentTree,
    initialNodes,
    initialParentMap,
    initialize,
  };
};

export default useInitializeSegmentTree;
