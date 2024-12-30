import Konva from "konva";

export const animateMove = (shape, newX, newY) => {
  if (!shape) return;
  new Konva.Tween({
    node: shape,
    duration: 0.5,
    x: newX,
    y: newY,
    easing: Konva.Easings.EaseInOut,
  }).play();
};

export const animateAppear = (shape, finalX, finalY) => {
  if (!shape) return;

  shape.scale({ x: 0, y: 0 });
  shape.y(finalY - 50);
  new Konva.Tween({
    node: shape,
    duration: 0.5,
    scaleX: 1,
    scaleY: 1,
    y: finalY,
    easing: Konva.Easings.EaseOut,
  }).play();
};

export const animateDisappear = (shape, callback) => {
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
    },
  }).play();
};
