// hooks/useUpdateSegmentTree.ts
import { useCallback } from 'react';
import SegmentTreeWasm from '../../../SegmentTreeWasm';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import {
  animateNodeMove,
  animateNodeAppear,
  animateNodeDisappear
} from '../../../visualisationComponents/nodeAnimations/nodeAnimations';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';
import Konva from 'konva';

interface UseUpdateSegmentTreeProps {
  nodes: VisNode[];
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  parentMap: Record<number, number>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  segmentTree: SegmentTreeWasm | null;
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
}

interface UseUpdateSegmentTreeReturn {
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
}

const useUpdateSegmentTree = ({
  nodes,
  setNodes,
  parentMap,
  setParentMap,
  segmentTree,
  shapeRefs
}: UseUpdateSegmentTreeProps): UseUpdateSegmentTreeReturn => {
  
  const updateTreeWithNewData = useCallback(
    async (newData: number[]): Promise<VisNode[] | null> => {
      if (!segmentTree) {
        console.error('Экземпляр SegmentTreeWasm не инициализирован.');
        return null;
      }

      try {
        await segmentTree.setData(newData);
        const newVisNodes: VisNode[] = await segmentTree.getTreeForVisualization();

        if (!newVisNodes.length) {
          console.warn('Получены пустые узлы дерева.');
          return null;
        }

        const newParentMap = buildParentMap(newVisNodes);
        
        // Используем Set для быстрого поиска отсутствующих узлов
        const newNodeIds = new Set(newVisNodes.map(node => node.id));

        // Фильтруем удаленные узлы и анимируем их исчезновение
        const removedNodes = nodes.filter(node => !newNodeIds.has(node.id));
        removedNodes.forEach(node => animateNodeDisappear(node.id, shapeRefs.current));

        // Группируем перемещение и появление узлов
        const animations: (() => void)[] = [];

        newVisNodes.forEach(newNode => {
          const oldNode = nodes.find(node => node.id === newNode.id);

          if (oldNode) {
            if (oldNode.x !== newNode.x || oldNode.y !== newNode.y) {
              animations.push(() => animateNodeMove(newNode.id, newNode.x, newNode.y, shapeRefs.current, newParentMap));
            }
          } else {
            animations.push(() => animateNodeAppear(newNode.id, newNode.x, newNode.y, shapeRefs.current));
          }
        });

        // Запускаем анимации с минимальной задержкой
        setTimeout(() => animations.forEach(animate => animate()), 500);

        // Обновляем состояние одним вызовом
        setNodes(prevNodes => {
          setParentMap(newParentMap);
          return newVisNodes;
        });

        return newVisNodes;
      } catch (error) {
        console.error('Ошибка при обновлении дерева:', error);
        return null;
      }
    },
    [segmentTree, nodes, shapeRefs, setNodes, setParentMap]
  );

  return { updateTreeWithNewData };
};

export default useUpdateSegmentTree;
