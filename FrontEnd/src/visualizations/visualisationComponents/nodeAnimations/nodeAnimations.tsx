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
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  // Check if the node is a root
  const isRoot = parentMap[nodeId] === nodeId;

  if (isRoot) {
    console.log(`Корневой узел ${nodeId} перемещается без анимации.`);
    shape.to({
      x: newX,
      y: newY,
      duration: 0.5,
      onFinish: () => {},
    });
  } else {
    // Animate node movement using Tween
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {},
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
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  // Set initial attributes for appearance animation
  shape.position({ x, y });
  shape.opacity(0);
  
  // Animate node appearance
  shape.to({
    opacity: 1,
    duration: 0.5,
    easing: Konva.Easings.EaseInOut
  });
};


export const animateNodeDisappear = (
  nodeId: number,
  shapeRefs: Record<number, Konva.Circle>,
  callback?: () => void
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) {
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  // Анимация исчезновения узла
  shape.to({
    opacity: 0,
    duration: 0.5,
    easing: Konva.Easings.EaseInOut,
    onFinish: () => {
      // Удаляем форму из сцены Konva
      shape.remove();
      
      // Удаляем ссылку на форму из shapeRefs
      delete shapeRefs[nodeId];
      console.log(`Shape '${nodeId}' removed from canvas`);

      // Выполняем обратный вызов, если он предоставлен
      if (callback) callback();
    }
  });
};
