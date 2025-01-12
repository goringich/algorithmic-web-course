// hooks/useSegmentTree.ts
import { useEffect } from 'react';
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
  const { segmentTree, initialNodes, initialParentMap, initialize } = useInitializeSegmentTree({ initialData });
  const { nodes, parentMap, setNodes, setParentMap } = useSegmentTreeState();
  const { updateTreeWithNewData } = useUpdateSegmentTree({
    nodes,
    setNodes,
    parentMap,
    setParentMap,
    segmentTree,
    shapeRefs
  });

  useEffect(() => {
    initialize().then(() => {
      setNodes(initialNodes);
      setParentMap(initialParentMap);
    });
  }, [initialize, initialNodes, initialParentMap, setNodes, setParentMap]);

  return {
    nodes,
    parentMap,
    updateTreeWithNewData,
    setNodes,
    setParentMap
  };
};

export default useSegmentTree;
