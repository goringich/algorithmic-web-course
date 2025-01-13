// hooks/useSegmentTree.ts
import { useEffect, useCallback, useMemo } from 'react';
import useInitializeSegmentTree from './hooks/useInitializeSegmentTree';
import useSegmentTreeState from './hooks/useSegmentTreeState';
import useUpdateSegmentTree from './hooks/useUpdateSegmentTree';

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

  // Memoize initial nodes and parent map based on initial data
  const memoizedInitialNodes = useMemo(() => initialNodes, [initialNodes]);
  const memoizedInitialParentMap = useMemo(() => initialParentMap, [initialParentMap]);

  useEffect(() => {
    let isMounted = true;
    const initializeTree = async () => {
      try {
        await initialize();
        if (isMounted) {
          setNodes(memoizedInitialNodes);
          setParentMap(memoizedInitialParentMap);
        }
      } catch (error) {
        if (isMounted) {
          // Optionally handle the error, e.g., set an error state
          console.error('Failed to initialize segment tree:', error);
        }
      }
    };

    initializeTree();

    return () => {
      isMounted = false;
    };
  }, [initialize, memoizedInitialNodes, memoizedInitialParentMap, setNodes, setParentMap]);

  return {
    nodes,
    parentMap,
    updateTreeWithNewData,
    setNodes,
    setParentMap
  };
};

export default useSegmentTree;
