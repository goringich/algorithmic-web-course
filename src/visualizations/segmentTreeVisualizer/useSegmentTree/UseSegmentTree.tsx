import { useEffect } from "react";
import useInitializeSegmentTree from "./hooks/useInitializeSegmentTree";
import useSegmentTreeState from "./hooks/useSegmentTreeState";
import useUpdateSegmentTree from "./hooks/useUpdateSegmentTree";
import { VisNode } from "../../visualisationComponents/nodeAnimations/types/VisNode";
import Konva from "konva";

interface UseSegmentTreeProps {
  initialData: number[];
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
}

interface UseSegmentTreeReturn {
  nodes: VisNode[];
  parentMap: Record<string, string>;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function useSegmentTree({
  initialData,
  shapeRefs
}: UseSegmentTreeProps): UseSegmentTreeReturn {
  const { segmentTree, initialNodes, initialParentMap, initialize } =
    useInitializeSegmentTree({ initialData });
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
      // После инициализации прописываем в стейт
      setNodes(initialNodes);
      setParentMap(initialParentMap);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize]);

  return {
    nodes,
    parentMap,
    updateTreeWithNewData,
    setNodes,
    setParentMap
  };
}
