import { useEffect, useCallback } from 'react';
import { useInitializeSegmentTree } from './hooks/useInitializeSegmentTree';
import { useSegmentTreeState } from './hooks/useSegmentTreeState';
import { useUpdateSegmentTree } from './hooks/useUpdateSegmentTree';

interface UseSegmentTreeProps {
  initialData: number[];
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
}

interface UseSegmentTreeReturn {
  nodes: VisNode[];
  parentMap: Record<number, number>;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

const useSegmentTree = ({ initialData, shapeRefs }: UseSegmentTreeProps): UseSegmentTreeReturn => {
  const { segmentTree, initialize, initialNodes, initialParentMap } = useInitializeSegmentTree({ initialData });
  const { nodes, parentMap, setNodes, setParentMap } = useSegmentTreeState();
  const { updateTreeWithNewData } = useUpdateSegmentTree({
    nodes,
    setNodes,
    parentMap,
    setParentMap,
    segmentTree,
    shapeRefs
  });

  // Оборачиваем в useCallback, чтобы избежать ненужных перерисовок
  const initializeTree = useCallback(async () => {
    const abortController = new AbortController();

    try {
      await initialize();
      if (!abortController.signal.aborted) {
        setNodes(initialNodes);
        setParentMap(initialParentMap);
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error('Failed to initialize segment tree:', error);
      }
    }

    return () => {
      abortController.abort();
    };
  }, [initialize, initialNodes, initialParentMap, setNodes, setParentMap]);

  useEffect(() => {
    const cleanup = initializeTree();

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [initializeTree]);

  return {
    nodes,
    parentMap,
    updateTreeWithNewData,
    setNodes,
    setParentMap
  };
};

export default useSegmentTree;
