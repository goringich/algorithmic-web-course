import { useState, useCallback, useRef } from 'react';
import SegmentTreeWasm from '../../../SegmentTreeWasm';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';

interface UseInitializeSegmentTreeProps {
  initialData: number[];
}

interface UseInitializeSegmentTreeReturn {
  segmentTree: SegmentTreeWasm | null;
  initialNodes: VisNode[];
  initialParentMap: Record<number, number>;
  initialize: () => Promise<void>;
}

export const useInitializeSegmentTree = ({ initialData }: UseInitializeSegmentTreeProps): UseInitializeSegmentTreeReturn => {
  const segmentTreeRef = useRef<SegmentTreeWasm | null>(null);
  const [initialNodes, setInitialNodes] = useState<VisNode[]>([]);
  const [initialParentMap, setInitialParentMap] = useState<Record<number, number>>({});

  const initialize = useCallback(async () => {
    try {
      if (!segmentTreeRef.current) {
        console.log("Initializing Segment Tree"); // Проверка
        segmentTreeRef.current = new SegmentTreeWasm(initialData);
      }

      const nodes = await segmentTreeRef.current.getTreeForVisualization();
      setInitialNodes(nodes);
      const parentMap = buildParentMap(nodes);
      setInitialParentMap(parentMap);
    } catch (error) {
      console.error("Ошибка при инициализации дерева:", error);
    }
  }, [initialData]);

  return { segmentTree: segmentTreeRef.current, initialNodes, initialParentMap, initialize };
};

