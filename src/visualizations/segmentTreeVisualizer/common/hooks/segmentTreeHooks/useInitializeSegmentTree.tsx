// hooks/useInitializeSegmentTree.ts
import { useState, useCallback, useRef } from 'react';
import SegmentTreeWasm from '../../../../SegmentTreeWasm';
import { VisNode } from '../../../../visualisationComponents/nodeAnimations/types/VisNode';
import { buildParentMap } from '../../../../visualisationComponents/nodeAnimations/utils/buildParentMap';

interface UseInitializeSegmentTreeProps {
  initialData: number[];
}

interface UseInitializeSegmentTreeReturn {
  segmentTree: SegmentTreeWasm | null;
  initialNodes: VisNode[];
  initialParentMap: Record<number, number>;
  initialize: () => Promise<void>;
}

const useInitializeSegmentTree = ({ initialData }: UseInitializeSegmentTreeProps): UseInitializeSegmentTreeReturn => {
  const [initialNodes, setInitialNodes] = useState<VisNode[]>([]);
  const [initialParentMap, setInitialParentMap] = useState<Record<number, number>>({});
  const segmentTreeRef = useRef<SegmentTreeWasm | null>(null);

  const initialize = useCallback(async () => {
    if (segmentTreeRef.current) return; // Уже инициализировано

    try {
      const st = new SegmentTreeWasm(initialData);
      segmentTreeRef.current = st;

      const nodes = await st.getTreeForVisualization();
      setInitialNodes(nodes);
      const parentMap = buildParentMap(nodes);
      setInitialParentMap(parentMap);

      // console.log('Initial parentMap:', parentMap);
    } catch (error) {
      console.error("Ошибка при инициализации дерева:", error);
    }
  }, [initialData]);

  return { 
    segmentTree: segmentTreeRef.current, 
    initialNodes, 
    initialParentMap, 
    initialize 
  };
};

export default useInitializeSegmentTree;
