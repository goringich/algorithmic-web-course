import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
import { buildPathFromLeaf } from "../buildPathFromLeaf";
import { setHighlightedNodes } from "../../../../store/segmentTreeSlice";
import useNodeAnimations from "./useNodeAnimations";

export default function useHighlightPath() {
  const dispatch = useDispatch<AppDispatch>();
  const { nodes, parentMap, highlightedNodes } = useSelector((state: RootState) => state.segmentTree);
  const { animatePath, clearAllTimeouts } = useNodeAnimations({ dispatch });

  const highlightPathFromLeaf = useCallback(
    (leafNodeId: number) => {
      clearAllTimeouts();
      dispatch(setHighlightedNodes([]));
  
      const leafNode = nodes.find((node) => node.id === leafNodeId);
      if (!leafNode) {
        console.error(`[ERROR] Узел ${leafNodeId} не найден.`);
        return;
      }
  
      const pathIds = buildPathFromLeaf(leafNode.id, nodes, parentMap);
      console.log("[DEBUG] Вычисленный путь:", pathIds);
      if (pathIds.length === 0) {
        console.warn("[WARN] Нет пути для узла:", leafNodeId);
        return;
      }
  
      // Временно:
      dispatch(setHighlightedNodes(pathIds));
      // Вместо:
      // animatePath(pathIds, (updatedNodes) => {
      //   dispatch(setHighlightedNodes(updatedNodes));
      // });
    },
    [dispatch, nodes, parentMap, clearAllTimeouts]
  );
  
  return { highlightPathFromLeaf, highlightedNodes };
}
