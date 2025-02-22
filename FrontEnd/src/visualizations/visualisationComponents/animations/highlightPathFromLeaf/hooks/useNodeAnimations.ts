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
      const delay = 400;
      pathIds.forEach((nodeId, index) => {
        setAndStoreTimeout(() => {
          console.log("Подсвечиваем узел с id:", nodeId);
          setHighlightedNodes((prev) => {
            if (!prev.includes(nodeId)) return [...prev, nodeId];
            return prev;
          });
        }, index * delay);
        setAndStoreTimeout(() => {
          console.log("Подсвечиваем узел:", nodeId);
          setHighlightedNodes((prev) => {
            console.log("Предыдущее состояние:", prev);
            if (!prev.includes(nodeId)) {
              const updated = [...prev, nodeId];
              console.log("Новое состояние:", updated);
              return updated;
            }
            return prev;
          });
        }, index * delay);
        
      });
    },
    [setAndStoreTimeout, setHighlightedNodes, clearAllTimeouts]
  );

  return { animatePath, clearAllTimeouts };
}
