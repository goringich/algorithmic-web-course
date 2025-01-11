// hooks/useInitializeSegmentTree.ts
import { useState, useCallback, useEffect } from 'react';
import SegmentTreeWasm from '../../SegmentTreeWasm';
import { VisNode } from '../../visualisationComponents/nodeAnimations/types/VisNode';
import { buildParentMap } from '../../visualisationComponents/nodeAnimations/utils/buildParentMap';

interface UseInitializeSegmentTreeProps {
  initialData: number[];
}

const useInitializeSegmentTree = (initialData: number[]) => {
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<string, string>>({});
  const [segmentTree, setSegmentTree] = useState<SegmentTreeWasm | null>(null);
  const [loading, setLoading] = useState(true);

  const initializeTree = useCallback(async () => {
    try {
      const st = new SegmentTreeWasm(initialData);
      setSegmentTree(st);

      const initialNodes = await st.getTreeForVisualization();
      setNodes(initialNodes);
      setParentMap(buildParentMap(initialNodes));
    } catch (error) {
      console.error("Ошибка при инициализации дерева:", error);
    } finally {
      setLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    initializeTree();
  }, [initializeTree]);

  return { nodes, parentMap, segmentTree, loading };
};


export default useInitializeSegmentTree;
