import { useCallback, useMemo } from 'react';
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
  segmentTree: Promise<typeof import('../../../SegmentTreeWasm')> | null;
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
}

interface UseUpdateSegmentTreeReturn {
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
}

export const useUpdateSegmentTree = ({
  nodes,
  setNodes,
  parentMap,
  setParentMap,
  segmentTree,
  shapeRefs
}: UseUpdateSegmentTreeProps): UseUpdateSegmentTreeReturn => {
  
  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedParentMap = useMemo(() => parentMap, [parentMap]);

  const updateTreeWithNewData = useCallback(
    async (newData: number[]): Promise<VisNode[] | null> => {
      if (!segmentTree) {
        console.error('SegmentTreeWasm is not initialized.');
        return null;
      }

      try {
        const segmentTreeModule = await segmentTree; // Lazy load
        await segmentTreeModule.setData(newData);

        const newVisNodes: VisNode[] = await segmentTreeModule.getTreeForVisualization();

        if (!newVisNodes.length) {
          console.warn('Empty tree nodes received.');
          return null;
        }

        const newParentMap = buildParentMap(newVisNodes);

        // Find removed nodes
        const newNodeIds = new Set(newVisNodes.map(node => node.id));
        const removedNodes = memoizedNodes.filter(node => !newNodeIds.has(node.id));

        // Animate removed nodes
        removedNodes.forEach(node => animateNodeDisappear(node.id, shapeRefs.current));

        // Group animations
        const animations: (() => void)[] = [];
        newVisNodes.forEach(newNode => {
          const oldNode = memoizedNodes.find(node => node.id === newNode.id);
          if (oldNode) {
            if (oldNode.x !== newNode.x || oldNode.y !== newNode.y) {
              animations.push(() => animateNodeMove(newNode.id, newNode.x, newNode.y, shapeRefs.current, newParentMap));
            }
          } else {
            animations.push(() => animateNodeAppear(newNode.id, newNode.x, newNode.y, shapeRefs.current));
          }
        });

        requestAnimationFrame(() => animations.forEach(animate => animate()));

        // Log tree updates
        console.log(`Tree updated: Old nodes: ${memoizedNodes.length}, New nodes: ${newVisNodes.length}`);

        // Batch updates
        setTimeout(() => {
          setParentMap(newParentMap);
          setNodes(newVisNodes);
        }, 300);

        return newVisNodes;
      } catch (error) {
        console.error('Error updating segment tree:', error);
        return null;
      }
    },
    [segmentTree, memoizedNodes, shapeRefs, setNodes, setParentMap]
  );

  return { updateTreeWithNewData };
};

