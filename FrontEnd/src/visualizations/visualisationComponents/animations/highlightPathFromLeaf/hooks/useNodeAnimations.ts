// useNodeAnimations.ts
import { useCallback } from "react";
import { VisNode } from "../../../../types/VisNode";
import useTimeouts from "./useTimeouts";

interface UseNodeAnimationsProps {
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

export default function useNodeAnimations({ setNodes }: UseNodeAnimationsProps) {
  const { setAndStoreTimeout, clearAllTimeouts } = useTimeouts();

  const animatePath = useCallback(
    (pathIds: number[]) => {
      clearAllTimeouts();
      console.log("Animating path for IDs:", pathIds);
      const delay = 400;

      pathIds.forEach((nodeId, index) => {
        // Подсветка узла
        setAndStoreTimeout(() => {
          setNodes((old) =>
            old.map((n) => (n.id === nodeId ? { ...n, isHighlighted: true } : n))
          );
        }, index * delay);

        // Если нужно снять подсветку через время, добавьте setTimeout ниже
        setAndStoreTimeout(() => {
          setNodes((old) =>
            old.map((n) => (n.id === nodeId ? { ...n, isHighlighted: false } : n))
          );
        }, index * delay + 1000);
      });
    },
    [setAndStoreTimeout, setNodes, clearAllTimeouts]
  );

  return { animatePath, clearAllTimeouts };
}
