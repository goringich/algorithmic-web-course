// src/visualisationComponents/highlightPathFromLeaf/useHighlightPath.tsx

import { useRef, useEffect } from 'react';
import { VisNode } from '../../segmentTreeVisualizer/SegmentTreeVisualizer';

interface UseHighlightPathProps {
  parentMap: Record<string, string>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

const useHighlightPath = ({ parentMap, setNodes }: UseHighlightPathProps) => {
  // Ссылка для хранения идентификаторов таймаутов
  const timeoutsRef = useRef<number[]>([]);

  const highlightPathFromLeaf = (leafNodeId: string) => {
    // Очистка существующих таймаутов
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];

    // Сброс всех подсветок
    setNodes((old) => old.map((n) => ({ ...n, isHighlighted: false })));

    // Построение пути от листа к корню
    const pathIds: string[] = [];
    let currentId: string | undefined = leafNodeId;
    while (currentId) {
      pathIds.push(currentId);
      const pId = parentMap[currentId];
      if (!pId || pId === currentId) break; // Предотвращение бесконечного цикла
      currentId = pId;
    }

    // Последовательная подсветка узлов с задержкой
    pathIds.forEach((nodeId, index) => {
      // Подсветка текущего узла
      const highlightTimeout = window.setTimeout(() => {
        setNodes((old) =>
          old.map((node) =>
            node.id === nodeId ? { ...node, isHighlighted: true } : node
          )
        );
      }, index * 800); // Задержка 800мс между подсветками

      // Снятие подсветки предыдущего узла
      if (index > 0) {
        const unhighlightTimeout = window.setTimeout(() => {
          const prevNodeId = pathIds[index - 1];
          setNodes((old) =>
            old.map((node) =>
              node.id === prevNodeId ? { ...node, isHighlighted: false } : node
            )
          );
        }, index * 800);
        timeoutsRef.current.push(unhighlightTimeout);
      }

      timeoutsRef.current.push(highlightTimeout);
    });

    // Снятие подсветки с последнего узла после завершения анимации
    if (pathIds.length > 0) {
      const finalUnhighlightTimeout = window.setTimeout(() => {
        const lastNodeId = pathIds[pathIds.length - 1];
        setNodes((old) =>
          old.map((node) =>
            node.id === lastNodeId ? { ...node, isHighlighted: false } : node
          )
        );
      }, pathIds.length * 800); // Задержка после последней подсветки
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
