import { VisNode } from '../../../../types/VisNode';
import { animateNodeAppear } from '../../../../visualisationComponents/nodeAnimations/animateNodeAppear';
import { animateNodeMove } from '../../../../visualisationComponents/nodeAnimations/animateNodeMove';
import Konva from 'konva';
import React from 'react';
import { createShapeRef } from '../functions/createShapeRef';

export function handleNodesUpdates(
  newNodes: VisNode[],
  oldNodes: VisNode[],
  shapeRefs: Record<string, Konva.Circle>,
  layerRef: React.MutableRefObject<Konva.Layer | null>,
  parentMap: Record<number, number | undefined>
): void {
  // newNodes.forEach(newN => {
  //   const key = newN.id.toString();
  //   const shapeRef = shapeRefs[key];
  //   const oldNode = oldNodes.find(p => p.id === newN.id);
  //   if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
  //     console.log(
  //       `[INFO] Node ${newN.id} position changed. Animating move.`
  //     );
  //     animateNodeMove(newN.id, newN.x, newN.y, shapeRefs, parentMap);
  //   }
  // });
}
