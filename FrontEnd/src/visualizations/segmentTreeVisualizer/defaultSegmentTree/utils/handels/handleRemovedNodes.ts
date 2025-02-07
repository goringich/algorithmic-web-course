import { VisNode } from '../../../../types/VisNode';
import { animateNodeDisappear } from '../../../../visualisationComponents/nodeAnimations/animateNodeDisappear';
import Konva from 'konva';

export function handleRemovedNodes(
  oldNodes: VisNode[],
  newNodes: VisNode[],
  shapeRefs: Record<string, Konva.Circle>
): void {
  const removedNodes = oldNodes.filter(oldNode => !newNodes.some(n => n.id === oldNode.id));
  removedNodes.forEach(rn => {
    console.log(`[INFO] Animating disappearance for removed node ${rn.id}`);
    animateNodeDisappear(rn.id, shapeRefs)
      .then(() => console.log(`[DEBUG] Removal animation finished for node ${rn.id}`))
      .catch(err => console.error(`[ERROR] Removal animation failed for node ${rn.id}:`, err));
    delete shapeRefs[rn.id.toString()];
  });
}
