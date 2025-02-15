// import { useCallback } from 'react';
// import { VisNode } from '../../../types/VisNode';
// import { animateNodeAppear} from '../../../visualisationComponents/nodeAnimations/animateNodeAppear';
// import { animateNodeDisappear } from "../../../visualisationComponents/nodeAnimations/animateNodeDisappear";
// import { animateNodeMove } from "../../../visualisationComponents/nodeAnimations/animateNodeMove";
// import Konva from 'konva';


// interface UseSegmentTreeAnimationsProps {
//   shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
// }

// const useSegmentTreeAnimations = ({ shapeRefs }: UseSegmentTreeAnimationsProps) => {
//   const handleAnimations = useCallback(
//     (
//       oldNodes: VisNode[],
//       newNodes: VisNode[],
//       newParentMap: Record<number, number | undefined>
//     ) => {
//       const removedNodes = oldNodes.filter(oldNode => !newNodes.some(n => n.id === oldNode.id));
//       removedNodes.forEach(rn => animateNodeDisappear(rn.id, shapeRefs.current));

//       newNodes.forEach(newN => {
//         const oldNode = oldNodes.find(p => p.id === newN.id);
//         if (oldNode) {
//           if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
//             animateNodeMove(newN.id, newN.x, newN.y, shapeRefs.current, newParentMap);
//           }
//         } else {
//           setTimeout(() => {
//             animateNodeAppear(newN.id, newN.x, newN.y, shapeRefs.current);
//           }, 500);
//         }
//       });
//     },
//     [shapeRefs]
//   );

//   return { handleAnimations };
// };

// export default useSegmentTreeAnimations;