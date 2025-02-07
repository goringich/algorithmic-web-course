import Konva from 'konva';

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




