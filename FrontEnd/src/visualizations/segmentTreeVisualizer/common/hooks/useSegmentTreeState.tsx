import { useState } from 'react';
import { VisNode } from '../../../types/VisNode';

interface UseSegmentTreeStateReturn {
  nodes: VisNode[];
  parentMap: Record<number, number | undefined>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number | undefined>>>;
}

const useSegmentTreeState = (): UseSegmentTreeStateReturn => {
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<number, number | undefined>>({});

  return { nodes, parentMap, setNodes, setParentMap };
};

export default useSegmentTreeState;