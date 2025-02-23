import { useCallback } from "react";
import useTimeouts from "./useTimeouts";
import { AppDispatch } from "../../../../store/store";
import { setHighlightedNodes } from "../../../../store/segmentTreeSlice";

interface UseNodeAnimationsProps {
  dispatch: AppDispatch;
}

export default function useNodeAnimations({ dispatch }: UseNodeAnimationsProps) {
  const { setAndStoreTimeout, clearAllTimeouts } = useTimeouts();

  const animatePath = useCallback(
    (pathIds: number[], onUpdate: (nodes: number[]) => void) => {
      const delay = 400;
      let updatedNodes: number[] = [];

      pathIds.forEach((nodeId, index) => {
        setAndStoreTimeout(() => {
          updatedNodes = [...updatedNodes, nodeId];
          console.log("[DEBUG] Добавляем узел:", nodeId);
          dispatch(setHighlightedNodes(updatedNodes)); 
          onUpdate(updatedNodes);                    
        }, index * delay);
      });
    },
    [setAndStoreTimeout, dispatch]
  );

  return { animatePath, clearAllTimeouts };
}
