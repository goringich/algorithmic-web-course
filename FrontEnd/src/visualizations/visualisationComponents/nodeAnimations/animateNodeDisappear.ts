import Konva from 'konva';

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
