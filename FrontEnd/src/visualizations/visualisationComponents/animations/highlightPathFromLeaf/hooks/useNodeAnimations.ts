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
      console.log("Animating path for IDs:", pathIds);
      
      // Сброс предыдущих таймаутов
      clearAllTimeouts();
      const delay = 400;

      // Для каждого узла устанавливаем таймаут на подсветку, а затем на снятие подсветки
      pathIds.forEach((nodeId, index) => {
        // Подсветка узла
        setAndStoreTimeout(() => {
          console.log(`Highlighting node ${nodeId} at ${index * delay}ms`);
          setNodes((old) =>
            old.map((n) =>
              n.id === nodeId ? { ...n, isHighlighted: true } : n
            )
          );
        }, index * delay);

        // Снятие подсветки с того же узла через delay
        setAndStoreTimeout(() => {
          console.log(`Unhighlighting node ${nodeId} at ${(index + 1) * delay}ms`);
          setNodes((old) =>
            old.map((n) =>
              n.id === nodeId ? { ...n, isHighlighted: false } : n
            )
          );
        }, (index + 1) * delay);
      });
    },
    [setAndStoreTimeout, setNodes, clearAllTimeouts]
  );

  return { animatePath, clearAllTimeouts };
}
