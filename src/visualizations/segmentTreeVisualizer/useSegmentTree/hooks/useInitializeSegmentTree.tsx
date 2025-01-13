import { useState, useCallback, useRef } from "react";
import SegmentTreeWasm from "../../../SegmentTreeWasm";
import { VisNode } from "../../../visualisationComponents/nodeAnimations/types/VisNode";
import { buildParentMap } from "../../../visualisationComponents/nodeAnimations/utils/buildParentMap";

interface UseInitializeSegmentTreeProps {
  initialData: number[];
}

interface UseInitializeSegmentTreeReturn {
  segmentTree: SegmentTreeWasm | null;
  initialNodes: VisNode[];
  initialParentMap: Record<string, string>;
  initialize: () => Promise<void>;
}

export default function useInitializeSegmentTree({
  initialData
}: UseInitializeSegmentTreeProps): UseInitializeSegmentTreeReturn {
  const [initialNodes, setInitialNodes] = useState<VisNode[]>([]);
  const [initialParentMap, setInitialParentMap] = useState<Record<string, string>>({});
  const segmentTreeRef = useRef<SegmentTreeWasm | null>(null);

  const initialize = useCallback(async () => {
    if (segmentTreeRef.current) return; // Уже инициализировано

    try {
      const st = new SegmentTreeWasm(initialData);
      await st.setData(initialData); // На всякий случай вызываем setData

      // Получаем «числовые» узлы
      const rawNodes = await st.getTreeForVisualization();

      // Превращаем в VisNode
      const mappedVisNodes: VisNode[] = rawNodes.map((rn) => ({
        id: String(rn.id),
        x: rn.x,
        y: rn.y,
        range: rn.range,
        label: rn.label,
        value: rn.value,
        children: rn.children.map((c) => String(c))
      }));

      setInitialNodes(mappedVisNodes);
      const parentMap = buildParentMap(mappedVisNodes);
      setInitialParentMap(parentMap);

      segmentTreeRef.current = st;
    } catch (error) {
      console.error("Ошибка при инициализации дерева:", error);
    }
  }, [initialData]);

  return {
    segmentTree: segmentTreeRef.current,
    initialNodes,
    initialParentMap,
    initialize
  };
}
