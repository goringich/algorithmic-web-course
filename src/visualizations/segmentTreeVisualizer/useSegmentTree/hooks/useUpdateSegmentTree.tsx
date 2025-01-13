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
        console.error("Экземпляр SegmentTreeWasm не инициализирован.");
        return null;
      }

      try {
        // Обновляем данные и перестраиваем дерево
        await segmentTree.setData(newData);
        const newVisNodes: VisNode[] = await segmentTree.getTreeForVisualization();
        console.log('Обновленные узлы:', newVisNodes);

        // Создаем новую карту родителей
        const newParentMap: Record<number, number> = buildParentMap(newVisNodes);
        console.log('Новая parentMap:', newParentMap);

        // Определяем удаленные узлы и анимируем их исчезновение
        const removedNodes = nodes.filter(
          (oldNode) => !newVisNodes.some((newNode) => newNode.id === oldNode.id)
        );
        removedNodes.forEach((node) => animateNodeDisappear(node.id, shapeRefs.current));

        // Анимируем перемещение и появление узлов
        newVisNodes.forEach((newNode) => {
          const oldNode = nodes.find((node) => node.id === newNode.id);
          if (oldNode) {
            if (oldNode.x !== newNode.x || oldNode.y !== newNode.y) {
              animateNodeMove(newNode.id, newNode.x, newNode.y, shapeRefs.current, newParentMap);
            }
          } else {
            // Анимация появления нового узла с задержкой
            setTimeout(() => {
              animateNodeAppear(newNode.id, newNode.x, newNode.y, shapeRefs.current);
            }, 500);
          }
        });

        // Обновляем состояние parentMap и nodes
        setParentMap(newParentMap);
        setNodes(newVisNodes);

        console.log("Итоговая parentMap после обновления:", newParentMap);

        return newVisNodes;
      } catch (error) {
        console.error("Ошибка при обновлении дерева:", error);
        return null;
      }
    },
    [segmentTree, nodes, shapeRefs, setNodes, setParentMap]
  );

  return { updateTreeWithNewData };
};

export default useUpdateSegmentTree;
