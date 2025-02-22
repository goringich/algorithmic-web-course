import Konva from 'konva';

export const animateNodeAppear = (
  nodeId: number,
  x: number,
  y: number,
  shapeRefs: Record<number, Konva.Circle>,
  layer: Konva.Layer 
): void => {
  let shape = shapeRefs[nodeId];

  if (!shape) {
    console.error(`[ERROR] Shape for nodeId ${nodeId} not found in shapeRefs`);
    shape = new Konva.Circle({
      x,
      y,
      radius: 20,
      fill: 'blue',
      opacity: 0,
    });

    shapeRefs[nodeId] = shape; 
    layer.add(shape); 
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

  layer.batchDraw(); 
};
