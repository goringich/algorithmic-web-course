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


export const animateNodeAppear = (
  nodeId: number,
  x: number,
  y: number,
  shapeRefs: Record<number, Konva.Circle>
): void => {
  const shape = shapeRefs[nodeId];

  if (!shape) {
    console.error(`[ERROR] Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  console.log(`[INFO] Node ${nodeId} appearing at (${x}, ${y})`);

  shape.position({ x, y });
  shape.opacity(0);

  shape.to({
    opacity: 1,
    duration: 0.5,
    easing: Konva.Easings.EaseInOut,
    onFinish: () => {
      console.log(`[INFO] Node ${nodeId} fully appeared at (${x}, ${y})`);
    }
  });
};




export const animateNodeDisappear = (
  nodeId: number,
  shapeRefs: Record<number, Konva.Circle>
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const shape = shapeRefs[nodeId];
    
    if (!shape) {
      console.error(`[ERROR] Shape for nodeId ${nodeId} not found in shapeRefs`);
      return reject(new Error(`Shape for nodeId ${nodeId} not found`));
    }

    console.log(`[INFO] Animating disappearance of node ${nodeId}`);

    shape.to({
      opacity: 0,
      duration: 0.5,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {
        console.log(`[INFO] Node ${nodeId} fully disappeared, removing from canvas`);

        shape.remove();
        delete shapeRefs[nodeId];

        console.log(`[DEBUG] Node ${nodeId} removed from shapeRefs`);
        resolve();
      }
    });
  });
};
