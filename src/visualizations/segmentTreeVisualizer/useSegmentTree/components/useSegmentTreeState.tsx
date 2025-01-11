// hooks/useSegmentTreeState.ts
import { useState, useEffect } from 'react';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';

const useSegmentTreeState = (initialNodes: VisNode[], initialParentMap: Record<string, string>) => {
  const [nodes, setNodes] = useState<VisNode[]>(initialNodes);
  const [parentMap, setParentMap] = useState<Record<string, string>>(initialParentMap);

  useEffect(() => {
    setNodes(initialNodes);
    setParentMap(initialParentMap);
  }, [initialNodes, initialParentMap]);

  return { nodes, setNodes, parentMap, setParentMap };
};



export default useSegmentTreeState;
