import { useCallback } from "react";
import { VisNode } from "../../../types/VisNode";
import useTimeouts from "./useTimeouts";

interface UseNodeAnimationsProps {
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

export default function useNodeAnimations({ setNodes }: UseNodeAnimationsProps) {
  const { setAndStoreTimeout, clearAllTimeouts } = useTimeouts();

  const animatePath = useCallback(
    (pathIds: number[]) => {
      console.log("Animating path (Анимация пути) for IDs:", pathIds);
      pathIds.forEach((nodeId, index) => {
        console.log(`Setting timeout to highlight node ${nodeId} at ${index * 800}ms`);
        // Подсветка узла
        setAndStoreTimeout(() => {
          console.log(`Highlighting node ${nodeId}`);
          setNodes((old) =>
            old.map((n) =>
              n.id === nodeId ? { ...n, isHighlighted: true } : { ...n }
            )
          );
        }, index * 800);

        // Снятие подсветки с предыдущего узла
        if (index > 0) {
          const prevNodeId = pathIds[index - 1];
          console.log(`Setting timeout to unhighlight node ${prevNodeId} at ${index * 800}ms`);
          setAndStoreTimeout(() => {
            console.log(`Unhighlighting node ${prevNodeId}`);
            setNodes((old) =>
              old.map((n) =>
                n.id === prevNodeId ? { ...n, isHighlighted: false } : { ...n }
              )
            );
          }, index * 800);
        }
      });

      // Финальное снятие подсветки с последнего узла
      if (pathIds.length > 0) {
        const lastNodeId = pathIds[pathIds.length - 1];
        console.log(`Setting timeout to unhighlight last node ${lastNodeId} at ${pathIds.length * 800}ms`);
        setAndStoreTimeout(() => {
          console.log(`Final unhighlight of node ${lastNodeId}`);
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
