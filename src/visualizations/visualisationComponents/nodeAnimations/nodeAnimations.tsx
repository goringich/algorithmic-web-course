import Konva from "konva";
import { VisNode } from '../../segmentTreeVisualizer/SegmentTreeVisualizer'; 

// Builds a ParentMap map, where the key is the ID of the child node, the value is the ID of the parent node.
export const buildParentMap = (newNodes: VisNode[]): Record<string, string> => {
  const map: Record<string, string> = {};

  // Map each child to its parent
  for (const node of newNodes) {
    for (const childId of node.children) {
      if (map[childId] && map[childId] !== node.id) {
        console.warn(`Node ${childId} has multiple parents: ${map[childId]} and ${node.id}`);
      }
      map[childId] = node.id;
    }
  }

  // Assign self-reference for root nodes (nodes without a parent)
  newNodes.forEach(node => {
    if (!map[node.id]) {
      map[node.id] = node.id; // Self-reference indicates a root node
    }
  });

  // Identify root nodes
  const rootNodes = newNodes.filter(node => map[node.id] === node.id);

  if (rootNodes.length === 1) {
    console.log(`Root detected: ${rootNodes[0].id}`);
  } else if (rootNodes.length > 1) {
    console.error("Multiple root nodes detected:", rootNodes.map(n => n.id));
  } else {
    console.error("No root node found in the tree");
  }

  console.log("Final parentMap:", map);
  return map;
};



// Animates the node's movement to the new coordinates.
export const animateNodeMove = (
  nodeId: string,
  newX: number,
  newY: number,
  shapeRefs: Record<string, Konva.Circle>,
  parentMap?: Record<string, string> // Make parentMap optional
): void => {
  if (!parentMap) {
    console.error("animateNodeMove called with undefined parentMap");
    return;
  }

  const shape = shapeRefs[nodeId];
  if (!shape) {
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  if (!(nodeId in parentMap)) {
    console.error(`Node ${nodeId} not found in parentMap`);
    return;
  }

  if (parentMap[nodeId] === nodeId) { // Corrected root check
    shape.position({ x: newX, y: newY });
    return;
  }

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
      delete shapeRefs[nodeId];
      if (callback) callback();
    }
  }).play();
};
