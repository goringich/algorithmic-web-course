import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import SegmentTreeWasm from '../SegmentTreeWasm';
import { updateTreeWithNewData } from '../utils/updateTreeWithNewData';
import Konva from 'konva';
import React from 'react';

interface UseUpdateSegmentTreeProps {
  nodes: VisNode[];
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  parentMap: Record<number, number | undefined>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number | undefined>>>;
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
  const updateTree = React.useCallback(
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
    [nodes, segmentTree, shapeRefs, setNodes, setParentMap, layerRef, parentMap]
  );

  return { updateTreeWithNewData: updateTree };
};

export default useUpdateSegmentTree;
