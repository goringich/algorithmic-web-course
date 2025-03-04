import { useCallback } from 'react';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import { animateNodeMove, animateNodeAppear, animateNodeDisappear } from '../../../visualisationComponents/nodeAnimations/nodeAnimations';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';
import Konva from 'konva';

interface UseSegmentTreeAnimationsProps {
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
}

const useSegmentTreeAnimations = ({ shapeRefs }: UseSegmentTreeAnimationsProps) => {
  const handleAnimations = useCallback(
    (
      oldNodes: VisNode[],
      newNodes: VisNode[],
      newParentMap: Record<string, string>
    ) => {
      const removedNodes = oldNodes.filter(oldNode => !newNodes.some(n => n.id === oldNode.id));
      removedNodes.forEach(rn => animateNodeDisappear(rn.id, shapeRefs.current));

      newNodes.forEach(newN => {
        const oldNode = oldNodes.find(p => p.id === newN.id);
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
    },
    [shapeRefs]
  );

  return { handleAnimations };
};

export default useSegmentTreeAnimations;