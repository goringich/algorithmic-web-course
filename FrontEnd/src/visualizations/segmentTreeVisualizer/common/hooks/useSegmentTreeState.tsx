import { useState } from 'react';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';

interface UseSegmentTreeStateReturn {
  nodes: VisNode[];
  parentMap: Record<number, number>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

const useSegmentTreeState = (): UseSegmentTreeStateReturn => {
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<number, number>>({});

  return { nodes, parentMap, setNodes, setParentMap };
};

export default useSegmentTreeState;
