import Konva from "konva";

export const animateNodeMove = (
  nodeId: string,
  newX: number,
  newY: number,
  shapeRefs: Record<string, Konva.Circle>,
  parentMap: Record<string, string>
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) {
    console.error(`Shape for nodeId '${nodeId}' not found in shapeRefs`);
    return;
  }

  // Являемся ли мы корнем (parent = self)?
  const isRoot = parentMap[nodeId] === nodeId;
  if (isRoot) {
    shape.to({
      x: newX,
      y: newY,
      duration: 0.5
    });
  } else {
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut
    }).play();
  }
};

export const animateNodeAppear = (
  nodeId: string,
  x: number,
  y: number,
  shapeRefs: Record<string, Konva.Circle>
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) {
    console.error(`Shape for nodeId '${nodeId}' not found in shapeRefs`);
    return;
  }

  shape.position({ x, y });
  shape.opacity(0);

  shape.to({
    opacity: 1,
    duration: 0.5,
    easing: Konva.Easings.EaseInOut
  });
};

export const animateNodeDisappear = (
  nodeId: string,
  shapeRefs: Record<string, Konva.Circle>,
  callback?: () => void
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) {
    console.error(`Shape for nodeId '${nodeId}' not found in shapeRefs`);
    // Даже если shape не нашёлся, выполним callback, чтоб не подвешивать логику
    if (callback) callback();
    return;
  }

  shape.to({
    opacity: 0,
    duration: 0.5,
    easing: Konva.Easings.EaseInOut,
    onFinish: () => {
      shape.remove();
      delete shapeRefs[nodeId];
      console.log(`Shape '${nodeId}' removed from canvas`);
      if (callback) callback();
    }
  });
};
