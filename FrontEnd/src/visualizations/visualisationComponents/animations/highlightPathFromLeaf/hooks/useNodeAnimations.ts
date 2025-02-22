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
      clearAllTimeouts();
      const delay = 400;
      let updatedNodes: number[] = [];

      pathIds.forEach((nodeId, index) => {
        setAndStoreTimeout(() => {
          updatedNodes = [...updatedNodes, nodeId];
          dispatch(setHighlightedNodes(updatedNodes)); // 🔹 Обновляем в Redux
          onUpdate(updatedNodes);
        }, index * delay);
      });
    },
    [setAndStoreTimeout, clearAllTimeouts, dispatch]
  );

  return { animatePath, clearAllTimeouts };
}
