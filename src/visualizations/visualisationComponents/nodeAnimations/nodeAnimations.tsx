import Konva from "konva";
import { VisNode } from '../../segmentTreeVisualizer/SegmentTreeVisualizer'; 

// Builds a ParentMap map, where the key is the ID of the child node, the value is the ID of the parent node.
export const buildParentMap = (newNodes: VisNode[]): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const node of newNodes) {
    for (const childId of node.children) {
      map[childId] = node.id;
    }
  }

  // Root have not got parent, therefore we add it
  const rootNode = newNodes.find(node => !Object.values(map).includes(node.id));
  if (rootNode) {
    map[rootNode.id] = null;  
  }
  // console.log('parentMap построен:', map);
  return map;
};

// Animates the node's movement to the new coordinates.
export const animateNodeMove = (
  nodeId: string,
  newX: number,
  newY: number,
  shapeRefs: Record<string, Konva.Circle>
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) return;
  new Konva.Tween({
    node: shape,
    duration: 0.5,
    x: newX,
    y: newY,
    easing: Konva.Easings.EaseInOut
  }).play();
};

// Animates the appearance of a node.
export const animateNodeAppear = (
  nodeId: string,
  finalX: number,
  finalY: number,
  shapeRefs: Record<string, Konva.Circle>
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) return;
  shape.scale({ x: 0, y: 0 });
  shape.y(finalY - 50);
  new Konva.Tween({
    node: shape,
    duration: 0.5,
    scaleX: 1,
    scaleY: 1,
    y: finalY,
    easing: Konva.Easings.EaseOut
  }).play();
};

// Animates the node to disappear.
export const animateNodeDisappear = (
  nodeId: string,
  shapeRefs: Record<string, Konva.Circle>,
  callback?: () => void
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) {
    if (callback) callback();
    return;
  }
  new Konva.Tween({
    node: shape,
    duration: 0.5,
    scaleX: 0,
    scaleY: 0,
    easing: Konva.Easings.EaseIn,
    onFinish: () => {
      if (callback) callback();
    }
  }).play();
};
