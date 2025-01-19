import { useCallback } from 'react';
import { VisNode } from '../../nodeAnimations/types/VisNode';
import { buildPathFromLeaf } from '../buildPathFromLeaf';
import useNodeAnimations from './useNodeAnimations';

interface UseHighlightPathProps {
  nodes: VisNode[];
  parentMap: Record<number, number>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

const useHighlightPath = ({ nodes, parentMap, setNodes }: UseHighlightPathProps) => {
  const { animatePath, clearAllTimeouts } = useNodeAnimations({ setNodes });

  const highlightPathFromLeaf = useCallback(
    (leafNodeId: number) => {
      console.log(`Start highlighting from leaf: '${leafNodeId}'`);
      console.log("Current parentMap:", parentMap);
      console.log("Current nodes:", nodes);

      // Очистка существующих таймаутов и сброс выделений
      clearAllTimeouts();
      setNodes((oldNodes) => {
        const updatedNodes = oldNodes.map((n) => {
          if (n.isHighlighted) {
            return { ...n, isHighlighted: false };
          }
          return n;
        });
        return updatedNodes;
      });
      

      // Проверка существования leafNodeId в nodes
      const leafNode = nodes.find(n => n.id === leafNodeId);
      if (!leafNode) {
        console.error(`Leaf node with ID '${leafNodeId}' not found`);
        return;
      }

      // Построение пути от листа к корню
      const pathIds = buildPathFromLeaf(leafNodeId, nodes, parentMap);

      if (pathIds.length === 0) {
        console.warn(`No path found from leaf '${leafNodeId}' to root`);
        return;
      }

      // Анимация подсветки узлов
      animatePath(pathIds);
    },
    [nodes, parentMap, setNodes, animatePath, clearAllTimeouts]
  );

  return highlightPathFromLeaf;
};

export default useHighlightPath;
