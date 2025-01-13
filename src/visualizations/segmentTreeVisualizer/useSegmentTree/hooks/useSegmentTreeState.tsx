import { useState } from "react";
import { VisNode } from "../visualisationComponents/nodeAnimations/types/VisNode";

interface UseSegmentTreeStateReturn {
  nodes: VisNode[];
  parentMap: Record<string, string>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function useSegmentTreeState(): UseSegmentTreeStateReturn {
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<string, string>>({});

  return { nodes, parentMap, setNodes, setParentMap };
}
