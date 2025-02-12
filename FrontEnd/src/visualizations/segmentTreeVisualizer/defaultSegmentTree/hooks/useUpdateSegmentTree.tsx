import { useCallback } from 'react';
import SegmentTreeWasm from '../SegmentTreeWasm';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import { updateTreeWithNewData } from '../utils/updateTreeWithNewData';
import Konva from 'konva';

interface UseUpdateSegmentTreeProps {
  nodes: VisNode[];
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  parentMap: Record<number, number>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  segmentTree: SegmentTreeWasm | null;
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
  layerRef: React.MutableRefObject<Konva.Layer | null>;
}

interface UseUpdateSegmentTreeReturn {
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
}

const useUpdateSegmentTree = ({
  nodes,
  setNodes,
  parentMap,
  setParentMap,
  segmentTree,
  shapeRefs,
  layerRef
}: UseUpdateSegmentTreeProps): UseUpdateSegmentTreeReturn => {
  const updateTree = useCallback(
    (newData: number[]) =>
      updateTreeWithNewData(
        newData,
        segmentTree,
        nodes,
        setNodes,
        parentMap,
        setParentMap,
        shapeRefs,
        layerRef
      ),
    [nodes, segmentTree, shapeRefs, setNodes, setParentMap, layerRef]
  );

  return { updateTreeWithNewData: updateTree };
};

export default useUpdateSegmentTree;
