import { useCallback } from 'react';
import { VisNode } from '../../nodeAnimations/types/VisNode';
import useTimeouts from './useTimeouts';

interface UseNodeAnimationsProps {
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

const useNodeAnimations = ({ setNodes }: UseNodeAnimationsProps) => {
  const { setAndStoreTimeout, clearAllTimeouts } = useTimeouts();

  const animatePath = useCallback(
    (pathIds: number[]) => {
      pathIds.forEach((nodeId, index) => {
        // Подсветка узла
        setAndStoreTimeout(() => {
          console.log(`Highlighting node: '${nodeId}'`);
          setNodes((old) =>
            old.map((n) =>
              n.id === nodeId ? { ...n, isHighlighted: true } : n
            )
          );
        }, index * 800);

        // Снятие подсветки с предыдущего узла
        if (index > 0) {
          const prevNodeId = pathIds[index - 1];
          setAndStoreTimeout(() => {
            console.log(`Unhighlighting node: '${prevNodeId}'`);
            setNodes((old) =>
              old.map((n) =>
                n.id === prevNodeId ? { ...n, isHighlighted: false } : n
              )
            );
          }, index * 800);
        }
      });

      // Снятие подсветки с последнего узла после всех анимаций
      if (pathIds.length > 0) {
        const lastNodeId = pathIds[pathIds.length - 1];
        setAndStoreTimeout(() => {
          console.log(`Final unhighlighting of node: '${lastNodeId}'`);
          setNodes((old) =>
            old.map((n) =>
              n.id === lastNodeId ? { ...n, isHighlighted: false } : n
            )
          );
        }, pathIds.length * 800);
      }
    },
    [setAndStoreTimeout, setNodes]
  );

  return { animatePath, clearAllTimeouts };
};

export default useNodeAnimations;
