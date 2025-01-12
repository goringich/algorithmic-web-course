// hooks/useUpdateSegmentTree.ts
import { useCallback } from 'react';
import SegmentTreeWasm from '../../../SegmentTreeWasm';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import { animateNodeMove, animateNodeAppear, animateNodeDisappear } from '../../../visualisationComponents/nodeAnimations/nodeAnimations';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';

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
  const updateTreeWithNewData = useCallback(async (newData: number[]): Promise<VisNode[] | null> => {
    if (!segmentTree) {
      console.error("SegmentTreeWasm instance is not initialized.");
      return null;
    }

    try {
      // Обновляем данные и перестраиваем дерево
      await segmentTree.setData(newData);
      const newVisNodes = await segmentTree.getTreeForVisualization();
      console.log('Обновлённые узлы:', newVisNodes);

      let newParentMap = buildParentMap(newVisNodes);

      // Проверяем узлы, у которых нет родителя в newParentMap
      const orphanNodes = newVisNodes.filter(node => !newParentMap[node.id]);
      if (orphanNodes.length > 0) {
        console.warn("Orphan nodes detected, fixing structure.", orphanNodes);

        // Присоединяем сиротские узлы к первому узлу дерева (или к главному корню)
        orphanNodes.forEach(node => {
          const nodeId = node.id;
          const trueRootId = newVisNodes[0].id;
          newParentMap[nodeId] = trueRootId;
          console.log(`Reassigning orphan node '${nodeId}' to true root '${trueRootId}'`);
        });
      }

      console.log('Updated parentMap:', newParentMap);

      // Анимация исчезновения удалённых узлов
      const removedNodes = nodes.filter(oldNode => !newVisNodes.some(n => n.id === oldNode.id));
      removedNodes.forEach(rn => animateNodeDisappear(rn.id, shapeRefs.current));

      // Анимация перемещения и появления узлов
      newVisNodes.forEach(newN => {
        const oldNode = nodes.find(p => p.id === newN.id);
        if (oldNode) {
          if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
            animateNodeMove(newN.id, newN.x, newN.y, shapeRefs.current, newParentMap);
          }
        } else {
          setTimeout(() => {
            animateNodeAppear(newN.id, newN.x, newN.y, shapeRefs.current);
          }, 500);
        }
      });

      // Обновляем parentMap и nodes
      setParentMap(newParentMap);
      setNodes(newVisNodes);
      console.log("Final parentMap after refresh:", newParentMap);

      return newVisNodes;
    } catch (error) {
      console.error("Ошибка при обновлении дерева:", error);
      return null;
    }
  }, [nodes, segmentTree, shapeRefs, setNodes, setParentMap]);

  return { updateTreeWithNewData };
};

export default useUpdateSegmentTree;
