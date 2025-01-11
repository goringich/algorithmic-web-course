// hooks/useSegmentTree.ts
import { useState, useCallback, useEffect } from 'react';
import SegmentTreeWasm from '../../SegmentTreeWasm';
import { VisNode } from '../../visualisationComponents/nodeAnimations/types/VisNode';
import { animateNodeMove, animateNodeAppear, animateNodeDisappear } from '../../visualisationComponents/nodeAnimations/nodeAnimations';
import { buildParentMap } from '../../visualisationComponents/nodeAnimations/utils/buildParentMap';

interface UseSegmentTreeProps {
  initialData: number[];
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
}

interface UseSegmentTreeReturn {
  nodes: VisNode[];
  parentMap: Record<string, string>;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const useSegmentTree = ({ initialData, shapeRefs }: UseSegmentTreeProps): UseSegmentTreeReturn => {
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<string, string>>({});
  const [segmentTree, setSegmentTree] = useState<SegmentTreeWasm | null>(null);

  // Инициализация дерева
  const initializeTree = useCallback(async () => {
    try {
      const st = new SegmentTreeWasm(initialData);
      setSegmentTree(st);

      const initialNodes = await st.getTreeForVisualization();
      setNodes(initialNodes);
      setParentMap(buildParentMap(initialNodes));
    } catch (error) {
      console.error("Ошибка при инициализации дерева:", error);
    }
  }, [initialData]);

  useEffect(() => {
    initializeTree();
  }, [initializeTree]);

  // Функция для перестроения дерева
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
      const orphanNodes = newVisNodes.filter(node => !newParentMap[node.id.toString()]);
      if (orphanNodes.length > 0) {
        console.warn("Orphan nodes detected, fixing structure.", orphanNodes);
  
        // Присоединяем сиротские узлы к первому узлу дерева (или к главному корню)
        orphanNodes.forEach(node => {
          newParentMap[node.id.toString()] = newVisNodes[0].id.toString();
        });
      }
  
      console.log('Updated Parent Map:', newParentMap);
      if (!newParentMap['1']) {
        console.warn("Updated parent map does not contain node '1'. Assigning it as root if it exists.");
        const node1 = newVisNodes.find(node => node.id.toString() === '1');
        if (node1) {
          newParentMap['1'] = '1';
          console.log("Assigned node '1' as root.");
        }
      }
  
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
          }, 50);
        }
      });
  
      // Обновляем parentMap и nodes
      setParentMap(newParentMap);
      setNodes(newVisNodes);
      console.log("Final fixed parentMap after refresh:", newParentMap);
  
      return newVisNodes;
    } catch (error) {
      console.error("Ошибка при обновлении дерева:", error);
      return null;
    }
  }, [nodes, segmentTree, shapeRefs]);
  

  return {
    nodes,
    parentMap,
    updateTreeWithNewData,
    setNodes,
    setParentMap
  };
};

export default useSegmentTree;
