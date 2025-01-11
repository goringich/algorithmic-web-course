import { VisNode } from '../../segmentTreeVisualizer/SegmentTreeVisualizer';

// Функции анимации (примеры)
export const animateNodeMove = (
  nodeId: string,
  newX: number,
  newY: number,
  shapeRefs: Record<string, Konva.Circle>,
  parentMap: Record<string, string>
): void => {
  const shape = shapeRefs[nodeId];

  if (!shape) {
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  if (parentMap[nodeId] === nodeId) {
    console.log(`Корневой узел ${nodeId} перемещается без анимации.`);
    shape.to({
      x: newX,
      y: newY,
      duration: 0.5 // Короткая анимация, чтобы не было резкого скачка
    });
    return;
  }
  

  new Konva.Tween({
    node: shape,
    duration: 2,
    x: newX,
    y: newY,
    easing: Konva.Easings.EaseInOut
  }).play();
};

export const animateNodeAppear = (
  nodeId: string,
  x: number,
  y: number,
  shapeRefs: Record<string, Konva.Circle>
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) {
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  shape.setAttrs({ x, y, opacity: 0 });
  shape.to({
    opacity: 1,
    duration: 1,
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
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  shape.to({
    opacity: 0,
    duration: 1,
    easing: Konva.Easings.EaseInOut,
    onFinish: () => {
      setTimeout(() => {
        shape.destroy();
        delete shapeRefs[nodeId];
        if (callback) callback();
      }, 100); 
    }
  });
  
};
