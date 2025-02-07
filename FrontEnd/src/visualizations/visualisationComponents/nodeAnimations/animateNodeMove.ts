import Konva from 'konva';

export const animateNodeMove = (
  nodeId: number,
  newX: number,
  newY: number,
  shapeRefs: Record<number, Konva.Circle>,
  parentMap: Record<number, number>
): void => {
  const shape = shapeRefs[nodeId];

  if (!shape) {
    console.error(`[ERROR] Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  console.log(`[INFO] Moving node ${nodeId} to (${newX}, ${newY})`);

  const isRoot = parentMap[nodeId] === nodeId;

  if (isRoot) {
    console.log(`[DEBUG] Node ${nodeId} is root. Moving instantly.`);
    shape.to({
      x: newX,
      y: newY,
      duration: 0.5,
      onFinish: () => {
        console.log(`[INFO] Node ${nodeId} moved to (${newX}, ${newY})`);
      }
    });
  } else {
    console.log(`[DEBUG] Node ${nodeId} is not root. Animating movement.`);
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {
        console.log(`[INFO] Node ${nodeId} finished moving to (${newX}, ${newY})`);
      }
    }).play();
  }
};
