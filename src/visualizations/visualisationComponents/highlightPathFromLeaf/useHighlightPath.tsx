// src/visualisationComponents/highlightPathFromLeaf/useHighlightPath.tsx

import { useRef, useEffect } from 'react';
import { VisNode } from '../../segmentTreeVisualizer/SegmentTreeVisualizer';

interface UseHighlightPathProps {
  nodes: VisNode[];
  parentMap: Record<string, string>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

const useHighlightPath = ({ nodes, parentMap, setNodes }: UseHighlightPathProps) => {
  // Reference to store timeout IDs
  const timeoutsRef = useRef<number[]>([]);

  const highlightPathFromLeaf = (leafNodeId: string) => {
    console.log(`Start highlighting from leaf: ${leafNodeId}`);

    // Очистка существующих таймаутов
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];

    // Сброс всех выделений
    setNodes((old) => old.map((n) => ({ ...n, isHighlighted: false })));

    // Построение пути от листа к корню с обнаружением циклов
    const pathIds: string[] = [];
    let currentId: string | undefined = leafNodeId;
    const visited = new Set<string>();
    let pId: string | undefined = undefined; // Определяем pId вне цикла

    while (currentId && !visited.has(currentId)) {
      pathIds.push(currentId);
      visited.add(currentId);
      const currentNode = nodes.find(n => n.id === currentId);
      console.log(`Added to path: ${currentId} (Range: ${currentNode?.range})`);

      pId = parentMap[currentId];
      const parentNode = nodes.find(n => n.id === pId);
      console.log(`Parent of ${currentId}: ${pId} (Range: ${parentNode?.range})`);

      if (!pId || pId === currentId) { // Достигнут корень
        console.log(`Reached end of path at: ${currentId} (Range: ${currentNode?.range})`);
        break;
      }
      currentId = pId;
    }

    // Обнаружение цикла, исключая самореференцию корня
    if (pId && pId !== currentId && visited.has(pId)) {
      console.error(`Cycle detected at node: ${pId}`);
      // Опционально, можно остановить дальнейшую обработку
    }

    console.log(`Final path from leaf to root:`, pathIds.map(id => {
      const node = nodes.find(n => n.id === id);
      return node ? `${id} (Range: ${node.range})` : id;
    }));

    // Анимация последовательного выделения узлов с задержкой
    pathIds.forEach((nodeId, index) => {
      const node = nodes.find(n => n.id === nodeId);
      const highlightTimeout = window.setTimeout(() => {
        if (node) {
          console.log(`Highlighting node: ${nodeId} (Range: ${node.range})`);
          setNodes((old) =>
            old.map((n) =>
              n.id === nodeId ? { ...n, isHighlighted: true } : n
            )
          );
        }
      }, index * 800);

      if (index > 0) {
        const prevNodeId = pathIds[index - 1];
        const unhighlightTimeout = window.setTimeout(() => {
          console.log(`Unhighlighting node: ${prevNodeId} (Range: ${nodes.find(n => n.id === prevNodeId)?.range})`);
          setNodes((old) =>
            old.map((n) =>
              n.id === prevNodeId ? { ...n, isHighlighted: false } : n
            )
          );
        }, index * 800);
        timeoutsRef.current.push(unhighlightTimeout);
      }

      timeoutsRef.current.push(highlightTimeout);
    });

    // Снятие выделения с последнего узла после завершения анимации
    if (pathIds.length > 0) {
      const lastNodeId = pathIds[pathIds.length - 1];
      const finalUnhighlightTimeout = window.setTimeout(() => {
        console.log(`Final unhighlighting of node: ${lastNodeId} (Range: ${nodes.find(n => n.id === lastNodeId)?.range})`);
        setNodes((old) =>
          old.map((n) =>
            n.id === lastNodeId ? { ...n, isHighlighted: false } : n
          )
        );
      }, pathIds.length * 800);
      timeoutsRef.current.push(finalUnhighlightTimeout);
    }
  };

  // Очистка таймаутов при размонтировании компонента
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return highlightPathFromLeaf;
};

export default useHighlightPath;
