import { useCallback } from "react";
import { VisNode } from "../../nodeAnimations/types/VisNode";
import useTimeouts from "./useTimeouts";

interface UseNodeAnimationsProps {
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

export default function useNodeAnimations({ setNodes }: UseNodeAnimationsProps) {
  const { setAndStoreTimeout, clearAllTimeouts } = useTimeouts();

  const animatePath = useCallback(
    (pathIds: string[]) => {
      pathIds.forEach((nodeId, index) => {
        // Подсветка узла
        setAndStoreTimeout(() => {
          setNodes((old) =>
            old.map((n) =>
              n.id === nodeId ? { ...n, isHighlighted: true } : { ...n }
            )
          );
        }, index * 800);

        // Снятие подсветки с предыдущего
        if (index > 0) {
          const prevNodeId = pathIds[index - 1];
          setAndStoreTimeout(() => {
            setNodes((old) =>
              old.map((n) =>
                n.id === prevNodeId ? { ...n, isHighlighted: false } : { ...n }
              )
            );
          }, index * 800);
        }
      });

      // Финальное снятие подсветки с последнего
      if (pathIds.length > 0) {
        const lastNodeId = pathIds[pathIds.length - 1];
        setAndStoreTimeout(() => {
          setNodes((old) =>
            old.map((n) =>
              n.id === lastNodeId ? { ...n, isHighlighted: false } : { ...n }
            )
          );
        }, pathIds.length * 800);
      }
    },
    [setAndStoreTimeout, setNodes]
  );

  return { animatePath, clearAllTimeouts };
}
