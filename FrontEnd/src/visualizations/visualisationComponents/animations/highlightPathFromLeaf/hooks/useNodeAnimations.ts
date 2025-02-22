import { useCallback } from "react";
import useTimeouts from "./useTimeouts";

interface UseNodeAnimationsProps {
  setHighlightedNodes: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function useNodeAnimations({ setHighlightedNodes }: UseNodeAnimationsProps) {
  const { setAndStoreTimeout, clearAllTimeouts } = useTimeouts();

  const animatePath = useCallback(
    (pathIds: number[]) => {
      clearAllTimeouts();
      const delay = 400; // задержка (delay)
      pathIds.forEach((nodeId, index) => {
        setAndStoreTimeout(() => {
          setHighlightedNodes((prev) => {
            if (!prev.includes(nodeId)) return [...prev, nodeId];
            return prev;
          });
        }, index * delay);
        setAndStoreTimeout(() => {
          setHighlightedNodes((prev) => prev.filter((id) => id !== nodeId));
        }, index * delay + 1000);
      });
    },
    [setAndStoreTimeout, setHighlightedNodes, clearAllTimeouts]
  );

  return { animatePath, clearAllTimeouts };
}
